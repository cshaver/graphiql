export var SessionActionTypes;
(function (SessionActionTypes) {
    SessionActionTypes["OperationRequested"] = "OperationRequested";
    SessionActionTypes["EditorLoaded"] = "EditorLoaded";
    SessionActionTypes["OperationChanged"] = "OperationChanged";
    SessionActionTypes["VariablesChanged"] = "VariablesChanged";
    SessionActionTypes["OperationSucceeded"] = "OperationSucceeded";
    SessionActionTypes["OperationErrored"] = "OperationErrored";
    SessionActionTypes["TabChanged"] = "TabChanged";
})(SessionActionTypes || (SessionActionTypes = {}));
export var operationRequestAction = function () {
    return ({
        type: SessionActionTypes.OperationRequested,
    });
};
export var editorLoadedAction = function (context, editor) {
    return ({
        type: SessionActionTypes.EditorLoaded,
        payload: {
            context: context,
            editor: editor,
        },
    });
};
export var operationChangedAction = function (value, sessionId) {
    return ({
        type: SessionActionTypes.OperationChanged,
        payload: { value: value, sessionId: sessionId },
    });
};
export var variableChangedAction = function (value, sessionId) {
    return ({
        type: SessionActionTypes.VariablesChanged,
        payload: { value: value, sessionId: sessionId },
    });
};
export var operationSucceededAction = function (result, sessionId) {
    return ({
        type: SessionActionTypes.OperationSucceeded,
        payload: {
            result: result,
            sessionId: sessionId,
        },
    });
};
export var operationErroredAction = function (error, sessionId) {
    return ({
        type: SessionActionTypes.OperationErrored,
        payload: { error: error, sessionId: sessionId },
    });
};
export var tabChangedAction = function (pane, tabId) {
    return ({
        type: SessionActionTypes.TabChanged,
        payload: { pane: pane, tabId: tabId },
    });
};
//# sourceMappingURL=sessionActions.js.map