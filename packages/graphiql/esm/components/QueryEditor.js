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
import React from 'react';
import { jsx } from 'theme-ui';
import EditorWrapper from '../components/common/EditorWrapper';
import { useSessionContext } from '../api/providers/GraphiQLSessionProvider';
import { useEditorsContext } from '../api/providers/GraphiQLEditorsProvider';
export function QueryEditor(props) {
    var _a;
    var divRef = React.useRef(null);
    var editorRef = React.useRef();
    var _b = React.useState(false), ignoreChangeEvent = _b[0], setIgnoreChangeEvent = _b[1];
    var cachedValueRef = React.useRef((_a = props.operation) !== null && _a !== void 0 ? _a : '');
    var session = useSessionContext();
    var loadEditor = useEditorsContext().loadEditor;
    React.useEffect(function () {
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
    React.useEffect(function () {
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
    React.useEffect(function () {
        var editor = editorRef.current;
        if (!editor) {
            return;
        }
        if (props.editorOptions) {
            editor.updateOptions(props.editorOptions);
        }
    }, [props.editorOptions]);
    return (jsx(EditorWrapper, { sx: { height: '100%' }, className: "query-editor", "aria-label": "Query Editor", innerRef: divRef }));
}
//# sourceMappingURL=QueryEditor.js.map