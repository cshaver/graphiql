/// <reference types="monaco-editor/monaco" />
/// <reference types="src/typings/monaco" />
import type { worker, editor, Position, IRange } from 'monaco-editor';
import { CompletionItem as GraphQLCompletionItem, SchemaResponse } from 'graphql-languageservice';
import type { GraphQLSchema, DocumentNode } from 'graphql';
export declare type MonacoCompletionItem = monaco.languages.CompletionItem & {
    isDeprecated?: boolean;
    deprecationReason?: string | null;
};
export declare class GraphQLWorker {
    private _ctx;
    private _languageService;
    private _formattingOptions;
    constructor(ctx: worker.IWorkerContext, createData: monaco.languages.graphql.ICreateData);
    getSchemaResponse(_uri?: string): Promise<SchemaResponse>;
    loadSchema(_uri?: string): Promise<GraphQLSchema>;
    doValidation(uri: string): Promise<editor.IMarkerData[]>;
    doComplete(uri: string, position: Position): Promise<(GraphQLCompletionItem & {
        range: IRange;
    })[]>;
    doHover(uri: string, position: Position): Promise<{
        content: string | import("vscode-languageserver-types").MarkupContent | {
            language: string;
            value: string;
        } | import("vscode-languageserver-types").MarkedString[];
        range: monaco.IRange;
    }>;
    doFormat(text: string): Promise<string>;
    doParse(text: string): Promise<DocumentNode>;
    private _getTextDocument;
}
//# sourceMappingURL=GraphQLWorker.d.ts.map