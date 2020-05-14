export var EditorActionTypes;
(function (EditorActionTypes) {
    EditorActionTypes["EditorLoaded"] = "EditorLoaded";
})(EditorActionTypes || (EditorActionTypes = {}));
export var editorLoadedAction = function (editorKey, editor) {
    return ({
        type: EditorActionTypes.EditorLoaded,
        payload: { editor: editor, editorKey: editorKey },
    });
};
//# sourceMappingURL=editorActions.js.map