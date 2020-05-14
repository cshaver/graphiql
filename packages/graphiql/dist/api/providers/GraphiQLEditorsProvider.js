"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var editorActions_1 = require("../actions/editorActions");
var editor_worker_1 = __importDefault(require("worker-loader!monaco-editor/esm/vs/editor/editor.worker"));
var json_worker_1 = __importDefault(require("worker-loader!monaco-editor/esm/vs/language/json/json.worker"));
var graphql_worker_1 = __importDefault(require("worker-loader!../../workers/graphql.worker"));
window.MonacoEnvironment = {
    getWorker: function (_workerId, label) {
        if (label === 'graphqlDev') {
            return new graphql_worker_1.default();
        }
        if (label === 'json') {
            return new json_worker_1.default();
        }
        return new editor_worker_1.default();
    },
};
exports.editorReducer = function (state, action) {
    var _a;
    switch (action.type) {
        case editorActions_1.EditorActionTypes.EditorLoaded:
            return __assign(__assign({}, state), { editors: __assign(__assign({}, state.editors), (_a = {}, _a[action.payload.editorKey] = { editor: action.payload.editor }, _a)) });
        default: {
            return state;
        }
    }
};
exports.EditorContext = react_1.default.createContext({
    editors: {},
    loadEditor: function () {
        return {};
    },
});
exports.useEditorsContext = function () { return react_1.default.useContext(exports.EditorContext); };
function EditorsProvider(props) {
    var _a = react_1.default.useReducer(exports.editorReducer, {
        editors: {},
    }), state = _a[0], dispatch = _a[1];
    var loadEditor = react_1.useCallback(function (editorKey, editor) {
        dispatch(editorActions_1.editorLoadedAction(editorKey, editor));
    }, [dispatch]);
    return (react_1.default.createElement(exports.EditorContext.Provider, { value: __assign(__assign({}, state), { loadEditor: loadEditor }) }, props.children));
}
exports.EditorsProvider = EditorsProvider;
//# sourceMappingURL=GraphiQLEditorsProvider.js.map