"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const graphql_1 = require("graphql");
const graphql_language_service_parser_1 = require("graphql-language-service-parser");
const graphql_language_service_utils_1 = require("graphql-language-service-utils");
exports.SEVERITY = {
    Error: 'Error',
    Warning: 'Warning',
    Information: 'Information',
    Hint: 'Hint',
};
exports.DIAGNOSTIC_SEVERITY = {
    [exports.SEVERITY.Error]: 1,
    [exports.SEVERITY.Warning]: 2,
    [exports.SEVERITY.Information]: 3,
    [exports.SEVERITY.Hint]: 4,
};
function getDiagnostics(query, schema = null, customRules, isRelayCompatMode) {
    let ast = null;
    try {
        ast = graphql_1.parse(query);
    }
    catch (error) {
        const range = getRange(error.locations[0], query);
        return [
            {
                severity: exports.DIAGNOSTIC_SEVERITY.Error,
                message: error.message,
                source: 'GraphQL: Syntax',
                range,
            },
        ];
    }
    return validateQuery(ast, schema, customRules, isRelayCompatMode);
}
exports.getDiagnostics = getDiagnostics;
function validateQuery(ast, schema = null, customRules, isRelayCompatMode) {
    if (!schema) {
        return [];
    }
    const validationErrorAnnotations = mapCat(graphql_language_service_utils_1.validateWithCustomRules(schema, ast, customRules, isRelayCompatMode), error => annotations(error, exports.DIAGNOSTIC_SEVERITY.Error, 'Validation'));
    const deprecationWarningAnnotations = !graphql_1.findDeprecatedUsages
        ? []
        : mapCat(graphql_1.findDeprecatedUsages(schema, ast), error => annotations(error, exports.DIAGNOSTIC_SEVERITY.Warning, 'Deprecation'));
    return validationErrorAnnotations.concat(deprecationWarningAnnotations);
}
exports.validateQuery = validateQuery;
function mapCat(array, mapper) {
    return Array.prototype.concat.apply([], array.map(mapper));
}
function annotations(error, severity, type) {
    if (!error.nodes) {
        return [];
    }
    const highlightedNodes = [];
    error.nodes.forEach(node => {
        const highlightNode = node.kind !== 'Variable' && 'name' in node
            ? node.name
            : 'variable' in node
                ? node.variable
                : node;
        if (highlightNode) {
            assert_1.default(error.locations, 'GraphQL validation error requires locations.');
            const loc = error.locations[0];
            const highlightLoc = getLocation(highlightNode);
            const end = loc.column + (highlightLoc.end - highlightLoc.start);
            highlightedNodes.push({
                source: `GraphQL: ${type}`,
                message: error.message,
                severity,
                range: new graphql_language_service_utils_1.Range(new graphql_language_service_utils_1.Position(loc.line - 1, loc.column - 1), new graphql_language_service_utils_1.Position(loc.line - 1, end)),
            });
        }
    });
    return highlightedNodes;
}
function getRange(location, queryText) {
    const parser = graphql_language_service_parser_1.onlineParser();
    const state = parser.startState();
    const lines = queryText.split('\n');
    assert_1.default(lines.length >= location.line, 'Query text must have more lines than where the error happened');
    let stream = null;
    for (let i = 0; i < location.line; i++) {
        stream = new graphql_language_service_parser_1.CharacterStream(lines[i]);
        while (!stream.eol()) {
            const style = parser.token(stream, state);
            if (style === 'invalidchar') {
                break;
            }
        }
    }
    assert_1.default(stream, 'Expected Parser stream to be available.');
    const line = location.line - 1;
    const start = stream.getStartOfToken();
    const end = stream.getCurrentPosition();
    return new graphql_language_service_utils_1.Range(new graphql_language_service_utils_1.Position(line, start), new graphql_language_service_utils_1.Position(line, end));
}
exports.getRange = getRange;
function getLocation(node) {
    const typeCastedNode = node;
    const location = typeCastedNode.loc;
    assert_1.default(location, 'Expected ASTNode to have a location.');
    return location;
}
//# sourceMappingURL=getDiagnostics.js.map