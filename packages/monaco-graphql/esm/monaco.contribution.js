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
define(["require", "exports", "./defaults", "monaco-editor/esm/vs/editor/editor.api", "monaco-editor/esm/vs/basic-languages/graphql/graphql"], function (require, exports, defaults_1, monaco, graphql_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    monaco = __importStar(monaco);
    exports.monarchLanguage = graphql_1.language;
    exports.LANGUAGE_ID = 'graphqlDev';
    monaco.languages.register({
        id: exports.LANGUAGE_ID,
        extensions: ['.graphql', '.gql'],
        aliases: ['graphql'],
        mimetypes: ['application/graphql', 'text/graphql'],
    });
    const graphqlDefaults = new defaults_1.LanguageServiceDefaultsImpl({
        languageId: exports.LANGUAGE_ID,
        schemaConfig: defaults_1.schemaDefault,
        formattingOptions: defaults_1.formattingDefaults,
        modeConfiguration: defaults_1.modeConfigurationDefault,
    });
    function createAPI() {
        return {
            graphqlDefaults,
        };
    }
    monaco.languages.graphql = createAPI();
    monaco.languages.onLanguage(exports.LANGUAGE_ID, () => __awaiter(void 0, void 0, void 0, function* () {
        const graphqlMode = yield getMode();
        graphqlMode.setupMode(graphqlDefaults);
    }));
    function getMode() {
        return new Promise((resolve_1, reject_1) => { require(['./graphqlMode'], resolve_1, reject_1); }).then(__importStar);
    }
});
//# sourceMappingURL=monaco.contribution.js.map