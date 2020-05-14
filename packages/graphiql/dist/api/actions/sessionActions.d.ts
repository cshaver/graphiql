import { EditorContexts } from '../types';
export declare enum SessionActionTypes {
    OperationRequested = "OperationRequested",
    EditorLoaded = "EditorLoaded",
    OperationChanged = "OperationChanged",
    VariablesChanged = "VariablesChanged",
    OperationSucceeded = "OperationSucceeded",
    OperationErrored = "OperationErrored",
    TabChanged = "TabChanged"
}
export declare type ErrorPayload = {
    error: Error;
    sessionId: number;
};
export declare type SuccessPayload = {
    sessionId: number;
    result: string;
};
export declare type ChangeValuePayload = {
    sessionId: number;
    value: string;
};
export declare type SessionAction = OperationRequestedAction | EditorLoadedAction | OperationChangedAction | VariablesChangedAction | OperationSucceededAction | OperationErroredAction | TabChangedAction;
export declare const operationRequestAction: () => {
    readonly type: SessionActionTypes.OperationRequested;
};
export declare type OperationRequestedAction = ReturnType<typeof operationRequestAction>;
export declare const editorLoadedAction: (context: EditorContexts, editor: import("codemirror").Editor) => {
    readonly type: SessionActionTypes.EditorLoaded;
    readonly payload: {
        readonly context: EditorContexts;
        readonly editor: import("codemirror").Editor;
    };
};
declare type EditorLoadedAction = ReturnType<typeof editorLoadedAction>;
export declare const operationChangedAction: (value: string, sessionId: number) => {
    readonly type: SessionActionTypes.OperationChanged;
    readonly payload: {
        readonly value: string;
        readonly sessionId: number;
    };
};
export declare type OperationChangedAction = ReturnType<typeof operationChangedAction>;
export declare const variableChangedAction: (value: string, sessionId: number) => {
    readonly type: SessionActionTypes.VariablesChanged;
    readonly payload: {
        readonly value: string;
        readonly sessionId: number;
    };
};
export declare type VariablesChangedAction = ReturnType<typeof variableChangedAction>;
export declare const operationSucceededAction: (result: string, sessionId: number) => {
    readonly type: SessionActionTypes.OperationSucceeded;
    readonly payload: {
        readonly result: string;
        readonly sessionId: number;
    };
};
export declare type OperationSucceededAction = ReturnType<typeof operationSucceededAction>;
export declare const operationErroredAction: (error: Error, sessionId: number) => {
    readonly type: SessionActionTypes.OperationErrored;
    readonly payload: {
        readonly error: Error;
        readonly sessionId: number;
    };
};
export declare type OperationErroredAction = ReturnType<typeof operationErroredAction>;
export declare const tabChangedAction: (pane: string, tabId: number) => {
    readonly type: SessionActionTypes.TabChanged;
    readonly payload: {
        readonly pane: string;
        readonly tabId: number;
    };
};
export declare type TabChangedAction = ReturnType<typeof tabChangedAction>;
export {};
//# sourceMappingURL=sessionActions.d.ts.map