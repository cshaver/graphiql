"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_languageservice_1 = require("graphql-languageservice");
const utils_1 = require("./utils");
class GraphQLWorker {
    constructor(ctx, createData) {
        this._ctx = ctx;
        const serviceConfig = {
            schemaConfig: createData.schemaConfig,
        };
        if (createData.schemaLoader) {
            serviceConfig.schemaLoader = createData.schemaLoader;
        }
        this._languageService = new graphql_languageservice_1.LanguageService(serviceConfig);
        this._formattingOptions = createData.formattingOptions;
    }
    async getSchemaResponse(_uri) {
        return this._languageService.getSchemaResponse();
    }
    async loadSchema(_uri) {
        return this._languageService.getSchema();
    }
    async doValidation(uri) {
        const document = this._getTextDocument(uri);
        const graphqlDiagnostics = await this._languageService.getDiagnostics(uri, document);
        return graphqlDiagnostics.map(utils_1.toMarkerData);
    }
    async doComplete(uri, position) {
        const document = this._getTextDocument(uri);
        const graphQLPosition = utils_1.toGraphQLPosition(position);
        const suggestions = await this._languageService.getCompletion(uri, document, graphQLPosition);
        return suggestions.map(suggestion => utils_1.toCompletion(suggestion, graphql_languageservice_1.getRange({
            column: graphQLPosition.character + 1,
            line: graphQLPosition.line + 1,
        }, document)));
    }
    async doHover(uri, position) {
        const document = this._getTextDocument(uri);
        const graphQLPosition = utils_1.toGraphQLPosition(position);
        const hover = await this._languageService.getHover(uri, document, graphQLPosition);
        return {
            content: hover,
            range: utils_1.toMonacoRange(graphql_languageservice_1.getRange({
                column: graphQLPosition.character,
                line: graphQLPosition.line,
            }, document)),
        };
    }
    async doFormat(text) {
        const prettierStandalone = await Promise.resolve().then(() => __importStar(require('prettier/standalone')));
        const prettierGraphqlParser = await Promise.resolve().then(() => __importStar(require('prettier/parser-graphql')));
        return prettierStandalone.format(text, {
            ...this._formattingOptions,
            parser: 'graphql',
            plugins: [prettierGraphqlParser],
        });
    }
    async doParse(text) {
        return this._languageService.parse(text);
    }
    _getTextDocument(_uri) {
        const models = this._ctx.getMirrorModels();
        if (models.length > 0) {
            return models[0].getValue();
        }
        return '';
    }
}
exports.GraphQLWorker = GraphQLWorker;
//# sourceMappingURL=GraphQLWorker.js.map