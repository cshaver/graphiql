export function toMonacoRange(range) {
    return {
        startLineNumber: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLineNumber: range.end.line + 1,
        endColumn: range.end.character + 1,
    };
}
export function toGraphQLPosition(position) {
    return { line: position.lineNumber - 1, character: position.column - 1 };
}
export function toCompletion(entry, range) {
    return {
        label: entry.label,
        insertText: entry.insertText || entry.label,
        sortText: entry.sortText,
        filterText: entry.filterText,
        documentation: entry.documentation,
        detail: entry.detail,
        range: toMonacoRange(range),
        kind: entry.kind,
    };
}
export function toMarkerData(diagnostic) {
    return {
        startLineNumber: diagnostic.range.start.line + 1,
        endLineNumber: diagnostic.range.end.line + 1,
        startColumn: diagnostic.range.start.character + 1,
        endColumn: diagnostic.range.end.character,
        message: diagnostic.message,
        severity: 5,
        code: diagnostic.code || undefined,
    };
}
//# sourceMappingURL=utils.js.map