/// <reference types="monaco-editor/monaco" />
import React from 'react';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { SchemaConfig } from 'graphql-languageservice';
import { Storage } from '../utility/StorageAPI';
import { VariableToType } from '../utility/getQueryFacts';
import { GetDefaultFieldNamesFn } from '../utility/fillLeafs';
import { Unsubscribable, Fetcher } from '../types';
export declare type Maybe<T> = T | null | undefined;
declare type Formatters = {
    formatResult: (result: any) => string;
    formatError: (rawError: Error) => string;
};
export declare type GraphiQLProps = {
    uri: string;
    fetcher?: Fetcher;
    schemaConfig?: SchemaConfig;
    schema: GraphQLSchema | null;
    query?: string;
    variables?: string;
    operationName?: string;
    response?: string;
    storage?: Storage;
    defaultQuery?: string;
    defaultVariableEditorOpen?: boolean;
    onCopyQuery?: (query?: string) => void;
    onEditQuery?: (query?: string) => void;
    onEditVariables?: (value: string) => void;
    onEditOperationName?: (operationName: string) => void;
    onToggleDocs?: (docExplorerOpen: boolean) => void;
    getDefaultFieldNames?: GetDefaultFieldNamesFn;
    editorTheme?: string;
    onToggleHistory?: (historyPaneOpen: boolean) => void;
    readOnly?: boolean;
    docExplorerOpen?: boolean;
    formatResult?: (result: any) => string;
    formatError?: (rawError: Error) => string;
    variablesEditorOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
    operationEditorOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
    resultsEditorOptions?: monaco.editor.IStandaloneEditorConstructionOptions;
} & Partial<Formatters>;
export declare type GraphiQLState = {
    operationName?: string;
    docExplorerOpen: boolean;
    response?: string;
    editorFlex: number;
    variableEditorOpen: boolean;
    variableEditorHeight: number;
    historyPaneOpen: boolean;
    docExplorerWidth: number;
    isWaitingForResponse: boolean;
    subscription?: Unsubscribable | null;
    variableToType?: VariableToType;
    operations?: OperationDefinitionNode[];
};
export declare const GraphiQL: React.FC<GraphiQLProps>;
export {};
//# sourceMappingURL=GraphiQL.d.ts.map