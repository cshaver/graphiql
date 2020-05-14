import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { CompletionItemKind as lsCompletionItemKind } from 'vscode-languageserver-types';
export class DiagnosticsAdapter {
    constructor(defaults, _worker) {
        this.defaults = defaults;
        this._worker = _worker;
        this._disposables = [];
        this._listener = Object.create(null);
        this._worker = _worker;
        const onModelAdd = (model) => {
            const modeId = model.getModeId();
            if (modeId !== this.defaults.languageId) {
                return;
            }
            let handle;
            this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
                clearTimeout(handle);
                handle = setTimeout(() => this._doValidate(model.uri, modeId), 200);
            });
            this._doValidate(model.uri, modeId);
        };
        const onModelRemoved = (model) => {
            editor.setModelMarkers(model, this.defaults.languageId, []);
            const uriStr = model.uri.toString();
            const listener = this._listener[uriStr];
            if (listener) {
                listener.dispose();
                delete this._listener[uriStr];
            }
        };
        this._disposables.push(editor.onDidCreateModel(onModelAdd));
        this._disposables.push(editor.onWillDisposeModel(model => {
            onModelRemoved(model);
        }));
        this._disposables.push(editor.onDidChangeModelLanguage(event => {
            onModelRemoved(event.model);
            onModelAdd(event.model);
        }));
        this._disposables.push(defaults.onDidChange((_) => {
            editor.getModels().forEach(model => {
                if (model.getModeId() === this.defaults.languageId) {
                    onModelRemoved(model);
                    onModelAdd(model);
                }
            });
        }));
        this._disposables.push({
            dispose: () => {
                for (const key in this._listener) {
                    this._listener[key].dispose();
                }
            },
        });
        editor.getModels().forEach(onModelAdd);
    }
    dispose() {
        this._disposables.forEach(d => d && d.dispose());
        this._disposables = [];
    }
    async _doValidate(resource, languageId) {
        const worker = await this._worker(resource);
        const diagnostics = await worker.doValidation(resource.toString());
        editor.setModelMarkers(editor.getModel(resource), languageId, diagnostics);
    }
}
const mKind = monaco.languages.CompletionItemKind;
export function toCompletionItemKind(kind) {
    switch (kind) {
        case lsCompletionItemKind.Text:
            return mKind.Text;
        case lsCompletionItemKind.Method:
            return mKind.Method;
        case lsCompletionItemKind.Function:
            return mKind.Function;
        case lsCompletionItemKind.Constructor:
            return mKind.Constructor;
        case lsCompletionItemKind.Field:
            return mKind.Field;
        case lsCompletionItemKind.Variable:
            return mKind.Variable;
        case lsCompletionItemKind.Class:
            return mKind.Class;
        case lsCompletionItemKind.Interface:
            return mKind.Interface;
        case lsCompletionItemKind.Module:
            return mKind.Module;
        case lsCompletionItemKind.Property:
            return mKind.Property;
        case lsCompletionItemKind.Unit:
            return mKind.Unit;
        case lsCompletionItemKind.Value:
            return mKind.Value;
        case lsCompletionItemKind.Enum:
            return mKind.Enum;
        case lsCompletionItemKind.Keyword:
            return mKind.Keyword;
        case lsCompletionItemKind.Snippet:
            return mKind.Snippet;
        case lsCompletionItemKind.Color:
            return mKind.Color;
        case lsCompletionItemKind.File:
            return mKind.File;
        case lsCompletionItemKind.Reference:
            return mKind.Reference;
        case lsCompletionItemKind.Folder:
            return mKind.Folder;
        case lsCompletionItemKind.EnumMember:
            return mKind.EnumMember;
        case lsCompletionItemKind.Constant:
            return mKind.Constant;
        case lsCompletionItemKind.Struct:
            return mKind.Struct;
        case lsCompletionItemKind.Event:
            return mKind.Event;
        case lsCompletionItemKind.Operator:
            return mKind.Operator;
        case lsCompletionItemKind.TypeParameter:
            return mKind.TypeParameter;
        default:
            return mKind.Text;
    }
}
export function toCompletion(entry) {
    return {
        label: entry.label,
        insertText: entry.insertText || entry.label,
        sortText: entry.sortText,
        filterText: entry.filterText,
        documentation: entry.documentation,
        detail: entry.detail,
        range: entry.range,
        kind: toCompletionItemKind(entry.kind),
    };
}
export class CompletionAdapter {
    constructor(_worker) {
        this._worker = _worker;
        this._worker = _worker;
    }
    get triggerCharacters() {
        return [' ', ':'];
    }
    async provideCompletionItems(model, position, _context, _token) {
        try {
            const resource = model.uri;
            const worker = await this._worker(model.uri);
            const completionItems = await worker.doComplete(resource.toString(), position);
            return {
                incomplete: true,
                suggestions: completionItems.map(toCompletion),
            };
        }
        catch (err) {
            console.error(`Error fetching completion items\n\n${err}`);
            return { suggestions: [] };
        }
    }
}
export class DocumentFormattingAdapter {
    constructor(_worker) {
        this._worker = _worker;
        this._worker = _worker;
    }
    async provideDocumentFormattingEdits(document, _options, _token) {
        const worker = await this._worker(document.uri);
        const text = document.getValue();
        const formatted = await worker.doFormat(text);
        return [
            {
                range: document.getFullModelRange(),
                text: formatted,
            },
        ];
    }
}
export class HoverAdapter {
    constructor(_worker) {
        this._worker = _worker;
    }
    async provideHover(model, position, _token) {
        const resource = model.uri;
        const worker = await this._worker(model.uri);
        const hoverItem = await worker.doHover(resource.toString(), position);
        if (hoverItem) {
            return {
                range: hoverItem.range,
                contents: [{ value: hoverItem.content }],
            };
        }
        return;
    }
    dispose() { }
}
//# sourceMappingURL=languageFeatures.js.map