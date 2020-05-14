import { OperationDefinitionNode } from 'graphql';
import { Unsubscribable } from '../types';
export declare type File = {
    uri: string;
    text?: string;
    json?: JSON;
    formattedText?: string;
};
export declare type GraphQLParams = {
    query: string;
    variables?: string;
    operationName?: string;
};
export declare type EditorContexts = 'operation' | 'variables' | 'results';
export declare type SessionState = {
    sessionId: number;
    operation: File;
    variables: File;
    results: File;
    operationLoading: boolean;
    operationErrors: Error[] | null;
    currentTabs?: {
        [pane: string]: number;
    };
    operations: OperationDefinitionNode[];
    subscription?: Unsubscribable | null;
    operationName?: string;
};
//# sourceMappingURL=types.d.ts.map