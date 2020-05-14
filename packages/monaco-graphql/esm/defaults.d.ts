import { IEvent } from 'monaco-editor';
export declare class LanguageServiceDefaultsImpl implements monaco.languages.graphql.LanguageServiceDefaults {
    private _onDidChange;
    private _schemaConfig;
    private _formattingOptions;
    private _modeConfiguration;
    private _languageId;
    constructor({ languageId, schemaConfig, modeConfiguration, formattingOptions, }: {
        languageId: string;
        schemaConfig: monaco.languages.graphql.SchemaConfig;
        modeConfiguration: monaco.languages.graphql.ModeConfiguration;
        formattingOptions: monaco.languages.graphql.FormattingOptions;
    });
    get onDidChange(): IEvent<monaco.languages.graphql.LanguageServiceDefaults>;
    get languageId(): string;
    get modeConfiguration(): monaco.languages.graphql.ModeConfiguration;
    get schemaConfig(): monaco.languages.graphql.SchemaConfig;
    get formattingOptions(): monaco.languages.graphql.FormattingOptions;
    setSchemaConfig(options: monaco.languages.graphql.SchemaConfig): void;
    updateSchemaConfig(options: Partial<monaco.languages.graphql.SchemaConfig>): void;
    setSchemaUri(schemaUri: string): void;
    setModeConfiguration(modeConfiguration: monaco.languages.graphql.ModeConfiguration): void;
    setFormattingOptions(formattingOptions: monaco.languages.graphql.FormattingOptions): void;
}
export declare const modeConfigurationDefault: Required<monaco.languages.graphql.ModeConfiguration>;
export declare const schemaDefault: Required<monaco.languages.graphql.SchemaConfig>;
export declare const formattingDefaults: Required<monaco.languages.graphql.FormattingOptions>;
//# sourceMappingURL=defaults.d.ts.map