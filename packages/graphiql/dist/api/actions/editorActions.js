"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EditorActionTypes;
(function (EditorActionTypes) {
    EditorActionTypes["EditorLoaded"] = "EditorLoaded";
})(EditorActionTypes = exports.EditorActionTypes || (exports.EditorActionTypes = {}));
exports.editorLoadedAction = function (editorKey, editor) {
    return ({
        type: EditorActionTypes.EditorLoaded,
        payload: { editor: editor, editorKey: editorKey },
    });
};
//# sourceMappingURL=editorActions.js.map