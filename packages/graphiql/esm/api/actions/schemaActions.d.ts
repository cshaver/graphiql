import { SchemaConfig } from '../../types';
import { GraphQLSchema } from 'graphql';
export declare enum SchemaActionTypes {
    SchemaChanged = "SchemaChanged",
    SchemaRequested = "SchemaRequested",
    SchemaSucceeded = "SchemaSucceeded",
    SchemaErrored = "SchemaErrored",
    SchemaReset = "SchemaReset"
}
export declare type SchemaAction = SchemaChangedAction | SchemaRequestedAction | SchemaSucceededAction | SchemaErroredAction | SchemaResetAction;
export declare const schemaChangedAction: (config: SchemaConfig) => {
    readonly type: SchemaActionTypes.SchemaChanged;
    readonly payload: SchemaConfig;
};
export declare type SchemaChangedAction = ReturnType<typeof schemaChangedAction>;
export declare const schemaRequestedAction: () => {
    readonly type: SchemaActionTypes.SchemaRequested;
};
export declare type SchemaRequestedAction = ReturnType<typeof schemaRequestedAction>;
export declare const schemaSucceededAction: (schema: GraphQLSchema) => {
    readonly type: SchemaActionTypes.SchemaSucceeded;
    readonly payload: GraphQLSchema;
};
export declare type SchemaSucceededAction = ReturnType<typeof schemaSucceededAction>;
export declare const schemaErroredAction: (error: Error) => {
    readonly type: SchemaActionTypes.SchemaErrored;
    readonly payload: Error;
};
export declare type SchemaErroredAction = ReturnType<typeof schemaErroredAction>;
export declare const schemaResetAction: () => {
    readonly type: SchemaActionTypes.SchemaReset;
};
export declare type SchemaResetAction = ReturnType<typeof schemaResetAction>;
//# sourceMappingURL=schemaActions.d.ts.map