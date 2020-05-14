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
import { jsx } from 'theme-ui';
import React from 'react';
import EditorWrapper from '../components/common/EditorWrapper';
import { useEditorsContext } from '../api/providers/GraphiQLEditorsProvider';
import { useSessionContext } from '../api/providers/GraphiQLSessionProvider';
export function VariableEditor(props) {
    var _a;
    var session = useSessionContext();
    var _b = React.useState(false), ignoreChangeEvent = _b[0], setIgnoreChangeEvent = _b[1];
    var editorRef = React.useRef();
    var cachedValueRef = React.useRef((_a = props.value) !== null && _a !== void 0 ? _a : '');
    var divRef = React.useRef(null);
    var loadEditor = useEditorsContext().loadEditor;
    React.useEffect(function () {
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
    React.useEffect(function () {
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
    React.useEffect(function () {
        var editor = editorRef.current;
        if (!editor) {
            return;
        }
        if (props.editorOptions) {
            editor.updateOptions(props.editorOptions);
        }
    }, [props.editorOptions]);
    return jsx(EditorWrapper, { className: "variables-editor", innerRef: divRef });
}
//# sourceMappingURL=VariableEditor.js.map