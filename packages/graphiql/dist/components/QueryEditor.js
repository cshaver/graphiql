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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var theme_ui_1 = require("theme-ui");
var EditorWrapper_1 = __importDefault(require("../components/common/EditorWrapper"));
var GraphiQLSessionProvider_1 = require("../api/providers/GraphiQLSessionProvider");
var GraphiQLEditorsProvider_1 = require("../api/providers/GraphiQLEditorsProvider");
function QueryEditor(props) {
    var _a;
    var divRef = react_1.default.useRef(null);
    var editorRef = react_1.default.useRef();
    var _b = react_1.default.useState(false), ignoreChangeEvent = _b[0], setIgnoreChangeEvent = _b[1];
    var cachedValueRef = react_1.default.useRef((_a = props.operation) !== null && _a !== void 0 ? _a : '');
    var session = GraphiQLSessionProvider_1.useSessionContext();
    var loadEditor = GraphiQLEditorsProvider_1.useEditorsContext().loadEditor;
    react_1.default.useEffect(function () {
        var _a, _b;
        require('monaco-graphql/esm/monaco.contribution');
        var editor = (editorRef.current = monaco.editor.create(divRef.current, __assign({ value: (_b = (_a = session === null || session === void 0 ? void 0 : session.operation) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '', language: 'graphqlDev', automaticLayout: true }, props.editorOptions)));
        if (!editor) {
            return;
        }
        loadEditor('operation', editor);
        editor.onDidChangeModelContent(function () {
            if (!ignoreChangeEvent) {
                cachedValueRef.current = editor.getValue();
                session.changeOperation(cachedValueRef.current);
                props.onEdit && props.onEdit(cachedValueRef.current);
            }
        });
    }, []);
    react_1.default.useEffect(function () {
        var _a;
        setIgnoreChangeEvent(true);
        var editor = editorRef.current;
        var op = (_a = session === null || session === void 0 ? void 0 : session.operation) === null || _a === void 0 ? void 0 : _a.text;
        if (editor && op && op !== cachedValueRef.current) {
            var thisValue = op || '';
            cachedValueRef.current = thisValue;
            editor.setValue(thisValue);
        }
        setIgnoreChangeEvent(false);
    }, [session, session.operation, session.operation.text]);
    react_1.default.useEffect(function () {
        var editor = editorRef.current;
        if (!editor) {
            return;
        }
        if (props.editorOptions) {
            editor.updateOptions(props.editorOptions);
        }
    }, [props.editorOptions]);
    return (theme_ui_1.jsx(EditorWrapper_1.default, { sx: { height: '100%' }, className: "query-editor", "aria-label": "Query Editor", innerRef: divRef }));
}
exports.QueryEditor = QueryEditor;
//# sourceMappingURL=QueryEditor.js.map