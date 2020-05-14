var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useCallback } from 'react';
import { editorLoadedAction, EditorActionTypes, } from '../actions/editorActions';
import EditorWorker from 'worker-loader!monaco-editor/esm/vs/editor/editor.worker';
import JSONWorker from 'worker-loader!monaco-editor/esm/vs/language/json/json.worker';
import GraphQLWorker from 'worker-loader!../../workers/graphql.worker';
window.MonacoEnvironment = {
    getWorker: function (_workerId, label) {
        if (label === 'graphqlDev') {
            return new GraphQLWorker();
        }
        if (label === 'json') {
            return new JSONWorker();
        }
        return new EditorWorker();
    },
};
export var editorReducer = function (state, action) {
    var _a;
    switch (action.type) {
        case EditorActionTypes.EditorLoaded:
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_a = {}, _a[action.payload.editorKey] = { editor: action.payload.editor }, _a)) });
        default: {
            return state;
        }
    }
};
export var EditorContext = React.createContext({
    editors: {},
    loadEditor: function () {
        return {};
    },
});
export var useEditorsContext = function () { return React.useContext(EditorContext); };
export function EditorsProvider(props) {
    var _a = React.useReducer(editorReducer, {
        editors: {},
    }), state = _a[0], dispatch = _a[1];
    var loadEditor = useCallback(function (editorKey, editor) {
        dispatch(editorLoadedAction(editorKey, editor));
    }, [dispatch]);
    return (React.createElement(EditorContext.Provider, { value: __assign(__assign({}, state), { loadEditor: loadEditor }) }, props.children));
}
//# sourceMappingURL=GraphiQLEditorsProvider.js.map