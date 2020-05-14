/// <reference types="monaco-editor/monaco" />
import React from 'react';
import { EditorAction } from '../actions/editorActions';
export declare type EditorLookup = {
    [editorKey: string]: {
        editor: monaco.editor.IStandaloneCodeEditor;
    };
};
export declare type EditorState = {
    editors: EditorLookup;
};
export declare type EditorReducer = React.Reducer<EditorState, EditorAction>;
export declare type EditorHandlers = {
    loadEditor: (editorKey: string, editor: monaco.editor.IStandaloneCodeEditor) => void;
};
export declare const editorReducer: EditorReducer;
export declare const EditorContext: React.Context<EditorState & EditorHandlers>;
export declare const useEditorsContext: () => EditorState & EditorHandlers;
export declare function EditorsProvider(props: {
    children?: any;
}): JSX.Element;
//# sourceMappingURL=GraphiQLEditorsProvider.d.ts.map