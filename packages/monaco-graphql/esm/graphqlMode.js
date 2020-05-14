import { WorkerManager } from './workerManager';
import { monarchLanguage } from './monaco.contribution';
import * as languageFeatures from './languageFeatures';
import { MonacoGraphQLApi } from './api';
export function setupMode(defaults) {
    const disposables = [];
    const providers = [];
    const client = new WorkerManager(defaults);
    const { languageId } = defaults;
    disposables.push(client);
    const worker = (...uris) => {
        try {
            return client.getLanguageServiceWorker(...uris);
        }
        catch (err) {
            throw Error('Error fetching graphql language service worker');
        }
    };
    monaco.languages.graphql.api = new MonacoGraphQLApi({ accessor: worker });
    console.log(monaco.languages.graphql.api.getSchema);
    monaco.languages.setLanguageConfiguration(languageId, richLanguageConfig);
    monaco.languages.setMonarchTokensProvider(languageId, monarchLanguage);
    function registerFormattingProvider() {
        const { modeConfiguration } = defaults;
        if (modeConfiguration.documentFormattingEdits) {
            providers.push(monaco.languages.registerDocumentFormattingEditProvider(defaults.languageId, new languageFeatures.DocumentFormattingAdapter(worker)));
        }
    }
    function registerProviders() {
        const { modeConfiguration } = defaults;
        disposeAll(providers);
        if (modeConfiguration.completionItems) {
            providers.push(monaco.languages.registerCompletionItemProvider(defaults.languageId, new languageFeatures.CompletionAdapter(worker)));
        }
        if (modeConfiguration.diagnostics) {
            providers.push(new languageFeatures.DiagnosticsAdapter(defaults, worker));
        }
        if (modeConfiguration.hovers) {
            providers.push(monaco.languages.registerHoverProvider(defaults.languageId, new languageFeatures.HoverAdapter(worker)));
        }
        registerFormattingProvider();
    }
    registerProviders();
    let { modeConfiguration, schemaConfig, formattingOptions } = defaults;
    defaults.onDidChange(newDefaults => {
        console.log({ newDefaults });
        if (newDefaults.modeConfiguration !== modeConfiguration) {
            modeConfiguration = newDefaults.modeConfiguration;
            registerProviders();
        }
        if (newDefaults.schemaConfig !== schemaConfig) {
            console.log('new schema opts');
            schemaConfig = newDefaults.schemaConfig;
            registerProviders();
        }
        if (newDefaults.formattingOptions !== formattingOptions) {
            formattingOptions = newDefaults.formattingOptions;
            registerFormattingProvider();
        }
    });
    disposables.push(asDisposable(providers));
    return asDisposable(disposables);
}
function asDisposable(disposables) {
    return { dispose: () => disposeAll(disposables) };
}
function disposeAll(disposables) {
    while (disposables.length) {
        disposables.pop()?.dispose();
    }
}
export const richLanguageConfig = {
    comments: {
        lineComment: '#',
    },
    brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
    ],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"""', close: '"""', notIn: ['string', 'comment'] },
        { open: '"', close: '"', notIn: ['string', 'comment'] },
    ],
    surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"""', close: '"""' },
        { open: '"', close: '"' },
    ],
    folding: {
        offSide: true,
    },
};
//# sourceMappingURL=graphqlMode.js.map