import React, { useEffect } from 'react';
import EditorWrapper from '../components/common/EditorWrapper';
import { useSessionContext } from '../api/providers/GraphiQLSessionProvider';
import { useEditorsContext } from '../api/providers/GraphiQLEditorsProvider';
export function ResultViewer(props) {
    var divRef = React.useRef(null);
    var viewerRef = React.useRef();
    var session = useSessionContext();
    var loadEditor = useEditorsContext().loadEditor;
    useEffect(function () {
        var _a, _b;
        var viewer = (viewerRef.current = monaco.editor.create(divRef.current, {
            value: (_b = (_a = session.results) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '',
            readOnly: true,
            language: 'json',
            automaticLayout: true,
            theme: props.editorTheme,
        }));
        loadEditor('results', viewer);
        props.onMouseUp && viewer.onMouseUp(props.onMouseUp);
        props.onRenderResults && viewer.onDidChangeModel(props.onRenderResults);
    }, []);
    useEffect(function () {
        if (viewerRef.current) {
            viewerRef.current.setValue(session.results.text || '');
        }
    }, [session.results, session.results.text]);
    React.useEffect(function () {
        var editor = viewerRef.current;
        if (!editor) {
            return;
        }
        if (props.editorOptions) {
            editor.updateOptions(props.editorOptions);
        }
    }, [props.editorOptions]);
    return (React.createElement(EditorWrapper, { className: "result-window", "aria-label": "Result Window", "aria-live": "polite", "aria-atomic": "true", innerRef: divRef }));
}
//# sourceMappingURL=ResultViewer.js.map