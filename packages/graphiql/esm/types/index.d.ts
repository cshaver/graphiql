/// <reference types="monaco-editor/monaco" />
import { GraphQLType } from 'graphql';
export declare namespace GraphiQL {
    type GetDefaultFieldNamesFn = (type: GraphQLType) => string[];
}
export declare type Maybe<T> = T | null | undefined;
export declare type ReactComponentLike = string | ((props: any, context?: any) => any) | (new (props: any, context?: any) => any);
export declare type ReactElementLike = {
    type: ReactComponentLike;
    props: any;
    key: string | number | null;
};
export declare type Unsubscribable = {
    unsubscribe: () => void;
};
export declare type Observable<T> = {
    subscribe(opts: {
        next: (value: T) => void;
        error: (error: any) => void;
        complete: () => void;
    }): Unsubscribable;
    subscribe(next: (value: T) => void, error: null | undefined, complete: () => void): Unsubscribable;
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Unsubscribable;
};
export declare type SchemaConfig = {
    uri: string;
    assumeValid?: boolean;
};
export declare type FetcherParams = {
    query: string;
    operationName?: string;
    variables?: string;
};
export declare type FetcherResult = string;
export declare type EditorOptions = monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions;
export declare type Fetcher = (graphQLParams: FetcherParams) => Promise<FetcherResult> | Observable<FetcherResult>;
export declare type ReactNodeLike = {} | ReactElementLike | Array<ReactNodeLike> | string | number | boolean | null | undefined;
//# sourceMappingURL=index.d.ts.map