"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const defaults_1 = require("./defaults");
const monaco = __importStar(require("monaco-editor/esm/vs/editor/editor.api"));
var graphql_1 = require("monaco-editor/esm/vs/basic-languages/graphql/graphql");
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
monaco.languages.onLanguage(exports.LANGUAGE_ID, async () => {
    const graphqlMode = await getMode();
    graphqlMode.setupMode(graphqlDefaults);
});
function getMode() {
    return Promise.resolve().then(() => __importStar(require('./graphqlMode')));
}
//# sourceMappingURL=monaco.contribution.js.map