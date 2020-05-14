"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const graphql_1 = require("graphql");
const graphql_language_service_interface_1 = require("graphql-language-service-interface");
const graphql_language_service_utils_1 = require("graphql-language-service-utils");
const path_1 = __importDefault(require("path"));
const GRAPHQL_SUCCESS_CODE = 0;
const GRAPHQL_FAILURE_CODE = 1;
function main(command, argv) {
    const filePath = argv.file && argv.file.trim();
    assert_1.default(argv.text || argv.file, 'A path to the GraphQL file or its contents is required.');
    const text = ensureText(argv.text, filePath);
    const schemaPath = argv.schemaPath && argv.schemaPath.trim();
    let exitCode;
    switch (command) {
        case 'autocomplete':
            const lines = text.split('\n');
            const row = parseInt(argv.row, 10) || lines.length - 1;
            const column = parseInt(argv.column, 10) || lines[lines.length - 1].length;
            const point = new graphql_language_service_utils_1.Position(row, column);
            exitCode = _getAutocompleteSuggestions(text, point, schemaPath);
            break;
        case 'outline':
            exitCode = _getOutline(text);
            break;
        case 'validate':
            exitCode = _getDiagnostics(filePath, text, schemaPath);
            break;
        default:
            throw new Error(`Unknown command '${command}'`);
    }
    process.exit(exitCode);
}
exports.default = main;
function _getAutocompleteSuggestions(queryText, point, schemaPath) {
    var _a;
    assert_1.default(schemaPath, 'A schema path is required to provide GraphQL autocompletion');
    try {
        const schema = schemaPath ? generateSchema(schemaPath) : null;
        const resultArray = schema
            ? graphql_language_service_interface_1.getAutocompleteSuggestions(schema, queryText, point)
            : [];
        const resultObject = resultArray.reduce((prev, cur, index) => {
            prev[index] = cur;
            return prev;
        }, {});
        process.stdout.write(JSON.stringify(resultObject, null, 2));
        return GRAPHQL_SUCCESS_CODE;
    }
    catch (error) {
        process.stderr.write(((_a = error === null || error === void 0 ? void 0 : error.stack) !== null && _a !== void 0 ? _a : String(error)) + '\n');
        return GRAPHQL_FAILURE_CODE;
    }
}
function _getDiagnostics(_filePath, queryText, schemaPath) {
    var _a;
    try {
        const schema = schemaPath ? generateSchema(schemaPath) : null;
        const resultArray = graphql_language_service_interface_1.getDiagnostics(queryText, schema);
        const resultObject = resultArray.reduce((prev, cur, index) => {
            prev[index] = cur;
            return prev;
        }, {});
        process.stdout.write(JSON.stringify(resultObject, null, 2));
        return GRAPHQL_SUCCESS_CODE;
    }
    catch (error) {
        process.stderr.write(((_a = error === null || error === void 0 ? void 0 : error.stack) !== null && _a !== void 0 ? _a : String(error)) + '\n');
        return GRAPHQL_FAILURE_CODE;
    }
}
function _getOutline(queryText) {
    var _a;
    try {
        const outline = graphql_language_service_interface_1.getOutline(queryText);
        if (outline) {
            process.stdout.write(JSON.stringify(outline, null, 2));
        }
        else {
            throw Error('Error parsing or no outline tree found');
        }
    }
    catch (error) {
        process.stderr.write(((_a = error === null || error === void 0 ? void 0 : error.stack) !== null && _a !== void 0 ? _a : String(error)) + '\n');
        return GRAPHQL_FAILURE_CODE;
    }
    return GRAPHQL_SUCCESS_CODE;
}
function ensureText(queryText, filePath) {
    let text = queryText;
    if (!text) {
        try {
            text = fs_1.default.readFileSync(filePath, 'utf8');
        }
        catch (error) {
            throw new Error(error);
        }
    }
    return text;
}
function generateSchema(schemaPath) {
    const schemaDSL = fs_1.default.readFileSync(schemaPath, 'utf8');
    const schemaFileExt = path_1.default.extname(schemaPath);
    switch (schemaFileExt) {
        case '.graphql':
            return graphql_1.buildSchema(schemaDSL);
        case '.json':
            return graphql_1.buildClientSchema(JSON.parse(schemaDSL));
        default:
            throw new Error('Unsupported schema file extention');
    }
}
//# sourceMappingURL=client.js.map