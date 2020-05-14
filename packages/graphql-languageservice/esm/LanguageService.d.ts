import { parse, GraphQLSchema, ParseOptions, ValidationRule } from 'graphql';
import type { Position } from 'graphql-language-service-types';
import { defaultSchemaLoader, SchemaConfig, SchemaResponse } from './schemaLoader';
export declare type GraphQLLspConfig = {
    parser?: typeof parse;
    schemaLoader?: typeof defaultSchemaLoader;
    schemaConfig: SchemaConfig;
};
export declare class LanguageService {
    private _parser;
    private _schema;
    private _schemaConfig;
    private _schemaResponse;
    private _schemaLoader;
    constructor({ parser, schemaLoader, schemaConfig }: GraphQLLspConfig);
    get schema(): GraphQLSchema;
    getSchema(): Promise<GraphQLSchema>;
    getSchemaResponse(): Promise<SchemaResponse>;
    loadSchemaResponse(): Promise<SchemaResponse>;
    loadSchema(): Promise<GraphQLSchema>;
    parse(text: string, options?: ParseOptions): Promise<import("graphql").DocumentNode>;
    getCompletion: (_uri: string, documentText: string, position: Position) => Promise<import("graphql-language-service-types").CompletionItem[]>;
    getDiagnostics: (_uri: string, documentText: string, customRules?: ValidationRule[] | undefined) => Promise<import("vscode-languageserver-types").Diagnostic[]>;
    getHover: (_uri: string, documentText: string, position: Position) => Promise<string | import("vscode-languageserver-types").MarkupContent | {
        language: string;
        value: string;
    } | import("vscode-languageserver-types").MarkedString[]>;
}
//# sourceMappingURL=LanguageService.d.ts.map