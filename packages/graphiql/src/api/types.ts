import { OperationDefinitionNode } from 'graphql';

import { Observable, Unsubscribable } from '../types';

export type FetcherParams = {
  query: string;
  operationName?: string;
  variables?: string;
};

export type FetcherResult = string;

export type Fetcher = (
  graphQLParams: FetcherParams,
  schemaConfig: SchemaConfig,
) => Promise<FetcherResult> | Observable<FetcherResult>;

export type File = {
  uri: string;
  text?: string;
  json?: JSON;
  formattedText?: string;
};

export type GraphQLParams = {
  query: string;
  variables?: string;
  operationName?: string;
};

export type SchemaConfig = {
  uri: string;
  assumeValid?: boolean;
};

export type EditorContexts = 'operation' | 'variables' | 'results';

export type SessionState = {
  sessionId: number;
  operation: File;
  variables: File;
  results: File;
  operationLoading: boolean;
  operationErrors: Error[] | null;
  editors: { [key in EditorContexts]: CodeMirror.Editor };
  // diagnostics?: IMarkerData[];
  currentTabs?: { [pane: string]: number }; // maybe this could live in another context for each "pane"? within session context
  operations: OperationDefinitionNode[];
  subscription?: Unsubscribable | null;
  operationName?: string; // current operation name
};
