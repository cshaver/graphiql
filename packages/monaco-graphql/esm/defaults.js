define(["require", "exports", "monaco-editor"], function (require, exports, monaco_editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LanguageServiceDefaultsImpl {
        constructor({ languageId, schemaConfig, modeConfiguration, formattingOptions, }) {
            this._onDidChange = new monaco_editor_1.Emitter();
            this._languageId = languageId;
            this.setSchemaConfig(schemaConfig);
            this.setModeConfiguration(modeConfiguration);
            this.setFormattingOptions(formattingOptions);
        }
        get onDidChange() {
            return this._onDidChange.event;
        }
        get languageId() {
            return this._languageId;
        }
        get modeConfiguration() {
            return this._modeConfiguration;
        }
        get schemaConfig() {
            return this._schemaConfig;
        }
        get formattingOptions() {
            return this._formattingOptions;
        }
        setSchemaConfig(options) {
            this._schemaConfig = options || Object.create(null);
            this._onDidChange.fire(this);
        }
        updateSchemaConfig(options) {
            this._schemaConfig = Object.assign(Object.assign({}, this._schemaConfig), options);
            this._onDidChange.fire(this);
        }
        setSchemaUri(schemaUri) {
            this.setSchemaConfig(Object.assign(Object.assign({}, this._schemaConfig), { schema: schemaUri }));
        }
        setModeConfiguration(modeConfiguration) {
            this._modeConfiguration = modeConfiguration || Object.create(null);
            this._onDidChange.fire(this);
        }
        setFormattingOptions(formattingOptions) {
            this._formattingOptions = formattingOptions || Object.create(null);
            this._onDidChange.fire(this);
        }
    }
    exports.LanguageServiceDefaultsImpl = LanguageServiceDefaultsImpl;
    exports.modeConfigurationDefault = {
        documentFormattingEdits: true,
        documentRangeFormattingEdits: false,
        completionItems: true,
        hovers: true,
        documentSymbols: false,
        tokens: false,
        colors: false,
        foldingRanges: false,
        diagnostics: true,
        selectionRanges: false,
    };
    exports.schemaDefault = {
        schema: 'http://localhost:8000',
        projects: [],
        documents: ['**.graphql'],
        schemaLoader: null,
    };
    exports.formattingDefaults = {
        prettierConfig: {
            tabsWidth: 5,
        },
    };
});
//# sourceMappingURL=defaults.js.map