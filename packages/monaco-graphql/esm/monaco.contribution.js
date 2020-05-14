import { LanguageServiceDefaultsImpl, schemaDefault, formattingDefaults, modeConfigurationDefault, } from './defaults';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
export { language as monarchLanguage } from 'monaco-editor/esm/vs/basic-languages/graphql/graphql';
export const LANGUAGE_ID = 'graphqlDev';
monaco.languages.register({
    id: LANGUAGE_ID,
    extensions: ['.graphql', '.gql'],
    aliases: ['graphql'],
    mimetypes: ['application/graphql', 'text/graphql'],
});
const graphqlDefaults = new LanguageServiceDefaultsImpl({
    languageId: LANGUAGE_ID,
    schemaConfig: schemaDefault,
    formattingOptions: formattingDefaults,
    modeConfiguration: modeConfigurationDefault,
});
function createAPI() {
    return {
        graphqlDefaults,
    };
}
monaco.languages.graphql = createAPI();
monaco.languages.onLanguage(LANGUAGE_ID, async () => {
    const graphqlMode = await getMode();
    graphqlMode.setupMode(graphqlDefaults);
});
function getMode() {
    return import('./graphqlMode');
}
//# sourceMappingURL=monaco.contribution.js.map