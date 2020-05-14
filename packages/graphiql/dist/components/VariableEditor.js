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
var theme_ui_1 = require("theme-ui");
var react_1 = __importDefault(require("react"));
var EditorWrapper_1 = __importDefault(require("../components/common/EditorWrapper"));
var GraphiQLEditorsProvider_1 = require("../api/providers/GraphiQLEditorsProvider");
var GraphiQLSessionProvider_1 = require("../api/providers/GraphiQLSessionProvider");
function VariableEditor(props) {
    var _a;
    var session = GraphiQLSessionProvider_1.useSessionContext();
    var _b = react_1.default.useState(false), ignoreChangeEvent = _b[0], setIgnoreChangeEvent = _b[1];
    var editorRef = react_1.default.useRef();
    var cachedValueRef = react_1.default.useRef((_a = props.value) !== null && _a !== void 0 ? _a : '');
    var divRef = react_1.default.useRef(null);
    var loadEditor = GraphiQLEditorsProvider_1.useEditorsContext().loadEditor;
    react_1.default.useEffect(function () {
        var _a, _b;
        var editor = (editorRef.current = monaco.editor.create(divRef.current, __assign({ value: ((_a = session === null || session === void 0 ? void 0 : session.variables) === null || _a === void 0 ? void 0 : _a.text) || '', language: 'json', theme: props === null || props === void 0 ? void 0 : props.editorTheme, readOnly: (_b = props === null || props === void 0 ? void 0 : props.readOnly) !== null && _b !== void 0 ? _b : false, automaticLayout: true }, props.editorOptions)));
        loadEditor('variables', editor);
        editor.onDidChangeModelContent(function () {
            if (!ignoreChangeEvent) {
                cachedValueRef.current = editor.getValue();
                session.changeVariables(cachedValueRef.current);
            }
        });
    }, []);
    react_1.default.useEffect(function () {
        var editor = editorRef.current;
        if (!editor) {
            return;
        }
        setIgnoreChangeEvent(true);
        if (session.variables.text !== cachedValueRef.current) {
            var thisValue = session.variables.text || '';
            cachedValueRef.current = thisValue;
            editor.setValue(thisValue);
        }
        setIgnoreChangeEvent(false);
    }, [session.variables.text]);
    react_1.default.useEffect(function () {
        var editor = editorRef.current;
        if (!editor) {
            return;
        }
        if (props.editorOptions) {
            editor.updateOptions(props.editorOptions);
        }
    }, [props.editorOptions]);
    return theme_ui_1.jsx(EditorWrapper_1.default, { className: "variables-editor", innerRef: divRef });
}
exports.VariableEditor = VariableEditor;
//# sourceMappingURL=VariableEditor.js.map