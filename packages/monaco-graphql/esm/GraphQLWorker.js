var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "graphql-languageservice", "./utils"], function (require, exports, graphql_languageservice_1, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
        getSchemaResponse(_uri) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._languageService.getSchemaResponse();
            });
        }
        loadSchema(_uri) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._languageService.getSchema();
            });
        }
        doValidation(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                const graphqlDiagnostics = yield this._languageService.getDiagnostics(uri, document);
                return graphqlDiagnostics.map(utils_1.toMarkerData);
            });
        }
        doComplete(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                const graphQLPosition = utils_1.toGraphQLPosition(position);
                const suggestions = yield this._languageService.getCompletion(uri, document, graphQLPosition);
                return suggestions.map(suggestion => utils_1.toCompletion(suggestion, graphql_languageservice_1.getRange({
                    column: graphQLPosition.character + 1,
                    line: graphQLPosition.line + 1,
                }, document)));
            });
        }
        doHover(uri, position) {
            return __awaiter(this, void 0, void 0, function* () {
                const document = this._getTextDocument(uri);
                const graphQLPosition = utils_1.toGraphQLPosition(position);
                const hover = yield this._languageService.getHover(uri, document, graphQLPosition);
                return {
                    content: hover,
                    range: utils_1.toMonacoRange(graphql_languageservice_1.getRange({
                        column: graphQLPosition.character,
                        line: graphQLPosition.line,
                    }, document)),
                };
            });
        }
        doFormat(text) {
            return __awaiter(this, void 0, void 0, function* () {
                const prettierStandalone = yield new Promise((resolve_1, reject_1) => { require(['prettier/standalone'], resolve_1, reject_1); }).then(__importStar);
                const prettierGraphqlParser = yield new Promise((resolve_2, reject_2) => { require(['prettier/parser-graphql'], resolve_2, reject_2); }).then(__importStar);
                return prettierStandalone.format(text, Object.assign(Object.assign({}, this._formattingOptions), { parser: 'graphql', plugins: [prettierGraphqlParser] }));
            });
        }
        doParse(text) {
            return __awaiter(this, void 0, void 0, function* () {
                return this._languageService.parse(text);
            });
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
});
//# sourceMappingURL=GraphQLWorker.js.map