"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_language_service_utils_1 = require("graphql-language-service-utils");
const assert_1 = __importDefault(require("assert"));
exports.LANGUAGE = 'GraphQL';
function getRange(text, node) {
    const location = node.loc;
    assert_1.default(location, 'Expected ASTNode to have a location.');
    return graphql_language_service_utils_1.locToRange(text, location);
}
function getPosition(text, node) {
    const location = node.loc;
    assert_1.default(location, 'Expected ASTNode to have a location.');
    return graphql_language_service_utils_1.offsetToPosition(text, location.start);
}
async function getDefinitionQueryResultForNamedType(text, node, dependencies) {
    const name = node.name.value;
    const defNodes = dependencies.filter(({ definition }) => definition.name && definition.name.value === name);
    if (defNodes.length === 0) {
        throw Error(`Definition not found for GraphQL type ${name}`);
    }
    const definitions = defNodes.map(({ filePath, content, definition }) => getDefinitionForNodeDefinition(filePath || '', content, definition));
    return {
        definitions,
        queryRange: definitions.map(_ => getRange(text, node)),
    };
}
exports.getDefinitionQueryResultForNamedType = getDefinitionQueryResultForNamedType;
async function getDefinitionQueryResultForFragmentSpread(text, fragment, dependencies) {
    const name = fragment.name.value;
    const defNodes = dependencies.filter(({ definition }) => definition.name.value === name);
    if (defNodes.length === 0) {
        throw Error(`Definition not found for GraphQL fragment ${name}`);
    }
    const definitions = defNodes.map(({ filePath, content, definition }) => getDefinitionForFragmentDefinition(filePath || '', content, definition));
    return {
        definitions,
        queryRange: definitions.map(_ => getRange(text, fragment)),
    };
}
exports.getDefinitionQueryResultForFragmentSpread = getDefinitionQueryResultForFragmentSpread;
function getDefinitionQueryResultForDefinitionNode(path, text, definition) {
    return {
        definitions: [getDefinitionForFragmentDefinition(path, text, definition)],
        queryRange: definition.name ? [getRange(text, definition.name)] : [],
    };
}
exports.getDefinitionQueryResultForDefinitionNode = getDefinitionQueryResultForDefinitionNode;
function getDefinitionForFragmentDefinition(path, text, definition) {
    const name = definition.name;
    if (!name) {
        throw Error('Expected ASTNode to have a Name.');
    }
    return {
        path,
        position: getPosition(text, definition),
        range: getRange(text, definition),
        name: name.value || '',
        language: exports.LANGUAGE,
        projectRoot: path,
    };
}
function getDefinitionForNodeDefinition(path, text, definition) {
    const name = definition.name;
    assert_1.default(name, 'Expected ASTNode to have a Name.');
    return {
        path,
        position: getPosition(text, definition),
        range: getRange(text, definition),
        name: name.value || '',
        language: exports.LANGUAGE,
        projectRoot: path,
    };
}
//# sourceMappingURL=getDefinition.js.map