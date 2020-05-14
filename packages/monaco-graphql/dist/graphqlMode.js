var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./workerManager", "./monaco.contribution", "./languageFeatures", "./api"], function (require, exports, workerManager_1, monaco_contribution_1, languageFeatures, api_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    languageFeatures = __importStar(languageFeatures);
    function setupMode(defaults) {
        var disposables = [];
        var providers = [];
        var client = new workerManager_1.WorkerManager(defaults);
        var languageId = defaults.languageId;
        disposables.push(client);
        var worker = function () {
            var uris = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                uris[_i] = arguments[_i];
            }
            try {
                return client.getLanguageServiceWorker.apply(client, uris);
            }
            catch (err) {
                throw Error('Error fetching graphql language service worker');
            }
        };
        monaco.languages.graphql.api = new api_1.MonacoGraphQLApi({ accessor: worker });
        console.log(monaco.languages.graphql.api.getSchema);
        monaco.languages.setLanguageConfiguration(languageId, exports.richLanguageConfig);
        monaco.languages.setMonarchTokensProvider(languageId, monaco_contribution_1.monarchLanguage);
        function registerFormattingProvider() {
            var modeConfiguration = defaults.modeConfiguration;
            if (modeConfiguration.documentFormattingEdits) {
                providers.push(monaco.languages.registerDocumentFormattingEditProvider(defaults.languageId, new languageFeatures.DocumentFormattingAdapter(worker)));
            }
        }
        function registerProviders() {
            var modeConfiguration = defaults.modeConfiguration;
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
        var modeConfiguration = defaults.modeConfiguration, schemaConfig = defaults.schemaConfig, formattingOptions = defaults.formattingOptions;
        defaults.onDidChange(function (newDefaults) {
            console.log({ newDefaults: newDefaults });
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
    exports.setupMode = setupMode;
    function asDisposable(disposables) {
        return { dispose: function () { return disposeAll(disposables); } };
    }
    function disposeAll(disposables) {
        var _a;
        while (disposables.length) {
            (_a = disposables.pop()) === null || _a === void 0 ? void 0 : _a.dispose();
        }
    }
    exports.richLanguageConfig = {
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
});
//# sourceMappingURL=graphqlMode.js.map