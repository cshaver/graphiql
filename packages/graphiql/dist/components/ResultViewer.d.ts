/// <reference types="monaco-editor/monaco" />
import type { EditorOptions } from '../types';
export declare type ResultViewerProps = {
    editorTheme?: string;
    editorOptions?: EditorOptions;
    onMouseUp?: (e: monaco.editor.IEditorMouseEvent) => void;
    onRenderResults?: (e: monaco.editor.IModelChangedEvent) => void;
};
export declare function ResultViewer(props: ResultViewerProps): JSX.Element;
//# sourceMappingURL=ResultViewer.d.ts.map