import React from 'react';
import { GraphQLSchema } from 'graphql';
import { SchemaConfig, Fetcher } from '../../types';
import { SchemaAction } from '../actions/schemaActions';
export declare type SchemaState = {
    schema: GraphQLSchema | null;
    isLoading: boolean;
    errors: Error[] | null;
    config: SchemaConfig;
};
export declare type SchemaReducer = React.Reducer<SchemaState, SchemaAction>;
export declare const initialReducerState: SchemaState;
export declare const getInitialState: (initialState?: Partial<SchemaState> | undefined) => SchemaState;
export declare type SchemaContextValue = SchemaState & ProjectHandlers;
export declare const SchemaContext: React.Context<SchemaContextValue>;
export declare const useSchemaContext: () => SchemaContextValue;
export declare const schemaReducer: SchemaReducer;
export declare type SchemaProviderProps = {
    config?: SchemaConfig;
    children?: any;
    fetcher: Fetcher;
};
export declare type ProjectHandlers = {
    loadCurrentSchema: (state: SchemaState) => Promise<void>;
    dispatch: React.Dispatch<SchemaAction>;
};
export declare function SchemaProvider({ config: userSchemaConfig, fetcher, ...props }: SchemaProviderProps): JSX.Element;
//# sourceMappingURL=GraphiQLSchemaProvider.d.ts.map