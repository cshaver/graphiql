"use strict";
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
var EditorWrapper_1 = __importDefault(require("../components/common/EditorWrapper"));
var GraphiQLSessionProvider_1 = require("../api/providers/GraphiQLSessionProvider");
var GraphiQLEditorsProvider_1 = require("../api/providers/GraphiQLEditorsProvider");
function ResultViewer(props) {
    var divRef = react_1.default.useRef(null);
    var viewerRef = react_1.default.useRef();
    var session = GraphiQLSessionProvider_1.useSessionContext();
    var loadEditor = GraphiQLEditorsProvider_1.useEditorsContext().loadEditor;
    react_1.useEffect(function () {
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
    react_1.useEffect(function () {
        if (viewerRef.current) {
            viewerRef.current.setValue(session.results.text || '');
        }
    }, [session.results, session.results.text]);
    react_1.default.useEffect(function () {
        var editor = viewerRef.current;
        if (!editor) {
            return;
        }
        if (props.editorOptions) {
            editor.updateOptions(props.editorOptions);
        }
    }, [props.editorOptions]);
    return (react_1.default.createElement(EditorWrapper_1.default, { className: "result-window", "aria-label": "Result Window", "aria-live": "polite", "aria-atomic": "true", innerRef: divRef }));
}
exports.ResultViewer = ResultViewer;
//# sourceMappingURL=ResultViewer.js.map