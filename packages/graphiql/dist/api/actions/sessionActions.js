"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SessionActionTypes;
(function (SessionActionTypes) {
    SessionActionTypes["OperationRequested"] = "OperationRequested";
    SessionActionTypes["EditorLoaded"] = "EditorLoaded";
    SessionActionTypes["OperationChanged"] = "OperationChanged";
    SessionActionTypes["VariablesChanged"] = "VariablesChanged";
    SessionActionTypes["OperationSucceeded"] = "OperationSucceeded";
    SessionActionTypes["OperationErrored"] = "OperationErrored";
    SessionActionTypes["TabChanged"] = "TabChanged";
})(SessionActionTypes = exports.SessionActionTypes || (exports.SessionActionTypes = {}));
exports.operationRequestAction = function () {
    return ({
        type: SessionActionTypes.OperationRequested,
    });
};
exports.editorLoadedAction = function (context, editor) {
    return ({
        type: SessionActionTypes.EditorLoaded,
        payload: {
            context: context,
            editor: editor,
        },
    });
};
exports.operationChangedAction = function (value, sessionId) {
    return ({
        type: SessionActionTypes.OperationChanged,
        payload: { value: value, sessionId: sessionId },
    });
};
exports.variableChangedAction = function (value, sessionId) {
    return ({
        type: SessionActionTypes.VariablesChanged,
        payload: { value: value, sessionId: sessionId },
    });
};
exports.operationSucceededAction = function (result, sessionId) {
    return ({
        type: SessionActionTypes.OperationSucceeded,
        payload: {
            result: result,
            sessionId: sessionId,
        },
    });
};
exports.operationErroredAction = function (error, sessionId) {
    return ({
        type: SessionActionTypes.OperationErrored,
        payload: { error: error, sessionId: sessionId },
    });
};
exports.tabChangedAction = function (pane, tabId) {
    return ({
        type: SessionActionTypes.TabChanged,
        payload: { pane: pane, tabId: tabId },
    });
};
//# sourceMappingURL=sessionActions.js.map