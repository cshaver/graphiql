"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const graphql_1 = require("graphql");
const getAutocompleteSuggestions_1 = require("./getAutocompleteSuggestions");
const getHoverInformation_1 = require("./getHoverInformation");
const getDiagnostics_1 = require("./getDiagnostics");
const getDefinition_1 = require("./getDefinition");
const getOutline_1 = require("./getOutline");
const graphql_language_service_utils_1 = require("graphql-language-service-utils");
const { FRAGMENT_DEFINITION, OBJECT_TYPE_DEFINITION, INTERFACE_TYPE_DEFINITION, ENUM_TYPE_DEFINITION, UNION_TYPE_DEFINITION, SCALAR_TYPE_DEFINITION, INPUT_OBJECT_TYPE_DEFINITION, SCALAR_TYPE_EXTENSION, OBJECT_TYPE_EXTENSION, INTERFACE_TYPE_EXTENSION, UNION_TYPE_EXTENSION, ENUM_TYPE_EXTENSION, INPUT_OBJECT_TYPE_EXTENSION, DIRECTIVE_DEFINITION, FRAGMENT_SPREAD, OPERATION_DEFINITION, NAMED_TYPE, } = graphql_1.Kind;
const KIND_TO_SYMBOL_KIND = {
    [graphql_1.Kind.FIELD]: vscode_languageserver_types_1.SymbolKind.Field,
    [graphql_1.Kind.OPERATION_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Class,
    [graphql_1.Kind.FRAGMENT_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Class,
    [graphql_1.Kind.FRAGMENT_SPREAD]: vscode_languageserver_types_1.SymbolKind.Struct,
    [graphql_1.Kind.OBJECT_TYPE_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Class,
    [graphql_1.Kind.ENUM_TYPE_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Enum,
    [graphql_1.Kind.ENUM_VALUE_DEFINITION]: vscode_languageserver_types_1.SymbolKind.EnumMember,
    [graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Class,
    [graphql_1.Kind.INPUT_VALUE_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Field,
    [graphql_1.Kind.FIELD_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Field,
    [graphql_1.Kind.INTERFACE_TYPE_DEFINITION]: vscode_languageserver_types_1.SymbolKind.Interface,
    [graphql_1.Kind.DOCUMENT]: vscode_languageserver_types_1.SymbolKind.File,
    FieldWithArguments: vscode_languageserver_types_1.SymbolKind.Method,
};
function getKind(tree) {
    if (tree.kind === 'FieldDefinition' &&
        tree.children &&
        tree.children.length > 0) {
        return KIND_TO_SYMBOL_KIND.FieldWithArguments;
    }
    return KIND_TO_SYMBOL_KIND[tree.kind];
}
class GraphQLLanguageService {
    constructor(cache) {
        this._graphQLCache = cache;
        this._graphQLConfig = cache.getGraphQLConfig();
    }
    getConfigForURI(uri) {
        const config = this._graphQLConfig.getProjectForFile(uri);
        if (config) {
            return config;
        }
        throw Error(`No config found for uri: ${uri}`);
    }
    async getDiagnostics(query, uri, isRelayCompatMode) {
        let queryHasExtensions = false;
        const projectConfig = this.getConfigForURI(uri);
        if (!projectConfig) {
            return [];
        }
        const { schema: schemaPath, name: projectName, extensions } = projectConfig;
        try {
            const queryAST = graphql_1.parse(query);
            if (!schemaPath || uri !== schemaPath) {
                queryHasExtensions = queryAST.definitions.some(definition => {
                    switch (definition.kind) {
                        case OBJECT_TYPE_DEFINITION:
                        case INTERFACE_TYPE_DEFINITION:
                        case ENUM_TYPE_DEFINITION:
                        case UNION_TYPE_DEFINITION:
                        case SCALAR_TYPE_DEFINITION:
                        case INPUT_OBJECT_TYPE_DEFINITION:
                        case SCALAR_TYPE_EXTENSION:
                        case OBJECT_TYPE_EXTENSION:
                        case INTERFACE_TYPE_EXTENSION:
                        case UNION_TYPE_EXTENSION:
                        case ENUM_TYPE_EXTENSION:
                        case INPUT_OBJECT_TYPE_EXTENSION:
                        case DIRECTIVE_DEFINITION:
                            return true;
                    }
                    return false;
                });
            }
        }
        catch (error) {
            const range = getDiagnostics_1.getRange(error.locations[0], query);
            return [
                {
                    severity: getDiagnostics_1.DIAGNOSTIC_SEVERITY.Error,
                    message: error.message,
                    source: 'GraphQL: Syntax',
                    range,
                },
            ];
        }
        let source = query;
        const fragmentDefinitions = await this._graphQLCache.getFragmentDefinitions(projectConfig);
        const fragmentDependencies = await this._graphQLCache.getFragmentDependencies(query, fragmentDefinitions);
        const dependenciesSource = fragmentDependencies.reduce((prev, cur) => `${prev} ${graphql_1.print(cur.definition)}`, '');
        source = `${source} ${dependenciesSource}`;
        let validationAst = null;
        try {
            validationAst = graphql_1.parse(source);
        }
        catch (error) {
            return [];
        }
        let customRules = null;
        const customValidationRules = extensions.customValidationRules;
        if (customValidationRules) {
            customRules = customValidationRules(this._graphQLConfig);
        }
        const schema = await this._graphQLCache.getSchema(projectName, queryHasExtensions);
        if (!schema) {
            return [];
        }
        return getDiagnostics_1.validateQuery(validationAst, schema, customRules, isRelayCompatMode);
    }
    async getAutocompleteSuggestions(query, position, filePath) {
        const projectConfig = this.getConfigForURI(filePath);
        const schema = await this._graphQLCache.getSchema(projectConfig.name);
        if (schema) {
            return getAutocompleteSuggestions_1.getAutocompleteSuggestions(schema, query, position);
        }
        return [];
    }
    async getHoverInformation(query, position, filePath) {
        const projectConfig = this.getConfigForURI(filePath);
        const schema = await this._graphQLCache.getSchema(projectConfig.name);
        if (schema) {
            return getHoverInformation_1.getHoverInformation(schema, query, position);
        }
        return '';
    }
    async getDefinition(query, position, filePath) {
        const projectConfig = this.getConfigForURI(filePath);
        let ast;
        try {
            ast = graphql_1.parse(query);
        }
        catch (error) {
            return null;
        }
        const node = graphql_language_service_utils_1.getASTNodeAtPosition(query, ast, position);
        if (node) {
            switch (node.kind) {
                case FRAGMENT_SPREAD:
                    return this._getDefinitionForFragmentSpread(query, ast, node, filePath, projectConfig);
                case FRAGMENT_DEFINITION:
                case OPERATION_DEFINITION:
                    return getDefinition_1.getDefinitionQueryResultForDefinitionNode(filePath, query, node);
                case NAMED_TYPE:
                    return this._getDefinitionForNamedType(query, ast, node, filePath, projectConfig);
            }
        }
        return null;
    }
    async getDocumentSymbols(document, filePath) {
        const outline = await this.getOutline(document);
        if (!outline) {
            return [];
        }
        const output = [];
        const input = outline.outlineTrees.map((tree) => [null, tree]);
        while (input.length > 0) {
            const res = input.pop();
            if (!res) {
                return [];
            }
            const [parent, tree] = res;
            if (!tree) {
                return [];
            }
            output.push({
                name: tree.representativeName,
                kind: getKind(tree),
                location: {
                    uri: filePath,
                    range: {
                        start: tree.startPosition,
                        end: tree.endPosition,
                    },
                },
                containerName: parent ? parent.representativeName : undefined,
            });
            input.push(...tree.children.map(child => [tree, child]));
        }
        return output;
    }
    async _getDefinitionForNamedType(query, ast, node, filePath, projectConfig) {
        const objectTypeDefinitions = await this._graphQLCache.getObjectTypeDefinitions(projectConfig);
        const dependencies = await this._graphQLCache.getObjectTypeDependenciesForAST(ast, objectTypeDefinitions);
        const localObjectTypeDefinitions = ast.definitions.filter(definition => definition.kind === OBJECT_TYPE_DEFINITION ||
            definition.kind === INPUT_OBJECT_TYPE_DEFINITION ||
            definition.kind === ENUM_TYPE_DEFINITION ||
            definition.kind === SCALAR_TYPE_DEFINITION ||
            definition.kind === INTERFACE_TYPE_DEFINITION);
        const typeCastedDefs = localObjectTypeDefinitions;
        const localOperationDefinationInfos = typeCastedDefs.map((definition) => ({
            filePath,
            content: query,
            definition,
        }));
        const result = await getDefinition_1.getDefinitionQueryResultForNamedType(query, node, dependencies.concat(localOperationDefinationInfos));
        return result;
    }
    async _getDefinitionForFragmentSpread(query, ast, node, filePath, projectConfig) {
        const fragmentDefinitions = await this._graphQLCache.getFragmentDefinitions(projectConfig);
        const dependencies = await this._graphQLCache.getFragmentDependenciesForAST(ast, fragmentDefinitions);
        const localFragDefinitions = ast.definitions.filter(definition => definition.kind === FRAGMENT_DEFINITION);
        const typeCastedDefs = localFragDefinitions;
        const localFragInfos = typeCastedDefs.map((definition) => ({
            filePath,
            content: query,
            definition,
        }));
        const result = await getDefinition_1.getDefinitionQueryResultForFragmentSpread(query, node, dependencies.concat(localFragInfos));
        return result;
    }
    async getOutline(documentText) {
        return getOutline_1.getOutline(documentText);
    }
}
exports.GraphQLLanguageService = GraphQLLanguageService;
//# sourceMappingURL=GraphQLLanguageService.js.map