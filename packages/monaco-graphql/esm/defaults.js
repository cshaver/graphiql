import { Emitter } from 'monaco-editor';
export class LanguageServiceDefaultsImpl {
    constructor({ languageId, schemaConfig, modeConfiguration, formattingOptions, }) {
        this._onDidChange = new Emitter();
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
        this._schemaConfig = { ...this._schemaConfig, ...options };
        this._onDidChange.fire(this);
    }
    setSchemaUri(schemaUri) {
        this.setSchemaConfig({ ...this._schemaConfig, uri: schemaUri });
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
export const modeConfigurationDefault = {
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
export const schemaDefault = {
    uri: 'http://localhost:8000',
    buildSchemaOptions: {
        assumeValid: true,
        assumeValidSDL: true,
        commentDescriptions: true,
    },
    introspectionOptions: { descriptions: true },
    requestOpts: {},
};
export const formattingDefaults = {
    prettierConfig: {
        tabWidth: 4,
    },
};
//# sourceMappingURL=defaults.js.map