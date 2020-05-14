"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const graphql_language_service_utils_1 = require("graphql-language-service-utils");
const findGraphQLTags_1 = require("./findGraphQLTags");
const DEFAULT_SUPPORTED_EXTENSIONS = ['js', 'ts', 'jsx', 'tsx'];
const DEFAULT_SUPPORTED_EXTENSIONS_FORMATTED = DEFAULT_SUPPORTED_EXTENSIONS.map(i => `.${i}`);
function parseDocument(text, uri, fileExtensions = DEFAULT_SUPPORTED_EXTENSIONS_FORMATTED) {
    const ext = path_1.extname(uri);
    if (fileExtensions.some(e => e === ext)) {
        if (findGraphQLTags_1.DEFAULT_TAGS.some(t => t === text)) {
            return [];
        }
        const templates = findGraphQLTags_1.findGraphQLTags(text, ext);
        return templates.map(({ template, range }) => ({ query: template, range }));
    }
    else {
        const query = text;
        if (!query && query !== '') {
            return [];
        }
        const lines = query.split('\n');
        const range = new graphql_language_service_utils_1.Range(new graphql_language_service_utils_1.Position(0, 0), new graphql_language_service_utils_1.Position(lines.length - 1, lines[lines.length - 1].length - 1));
        return [{ query, range }];
    }
}
exports.parseDocument = parseDocument;
//# sourceMappingURL=parseDocument.js.map