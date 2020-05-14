/// <reference types="monaco-editor/monaco" />
export declare enum EditorActionTypes {
    EditorLoaded = "EditorLoaded"
}
export declare type EditorAction = EditorLoadedAction;
export declare const editorLoadedAction: (editorKey: string, editor: monaco.editor.IStandaloneCodeEditor) => {
    readonly type: EditorActionTypes;
    readonly payload: {
        readonly editor: monaco.editor.IStandaloneCodeEditor;
        readonly editorKey: string;
    };
};
export declare type EditorLoadedAction = ReturnType<typeof editorLoadedAction>;
//# sourceMappingURL=editorActions.d.ts.map