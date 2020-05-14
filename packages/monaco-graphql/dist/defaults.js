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
define(["require", "exports", "monaco-editor"], function (require, exports, monaco_editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LanguageServiceDefaultsImpl = (function () {
        function LanguageServiceDefaultsImpl(_a) {
            var languageId = _a.languageId, schemaConfig = _a.schemaConfig, modeConfiguration = _a.modeConfiguration, formattingOptions = _a.formattingOptions;
            this._onDidChange = new monaco_editor_1.Emitter();
            this._languageId = languageId;
            this.setSchemaConfig(schemaConfig);
            this.setModeConfiguration(modeConfiguration);
            this.setFormattingOptions(formattingOptions);
        }
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "languageId", {
            get: function () {
                return this._languageId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "modeConfiguration", {
            get: function () {
                return this._modeConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "schemaConfig", {
            get: function () {
                return this._schemaConfig;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "formattingOptions", {
            get: function () {
                return this._formattingOptions;
            },
            enumerable: true,
            configurable: true
        });
        LanguageServiceDefaultsImpl.prototype.setSchemaConfig = function (options) {
            this._schemaConfig = options || Object.create(null);
            this._onDidChange.fire(this);
        };
        LanguageServiceDefaultsImpl.prototype.updateSchemaConfig = function (options) {
            this._schemaConfig = __assign(__assign({}, this._schemaConfig), options);
            this._onDidChange.fire(this);
        };
        LanguageServiceDefaultsImpl.prototype.setSchemaUri = function (schemaUri) {
            this.setSchemaConfig(__assign(__assign({}, this._schemaConfig), { schema: schemaUri }));
        };
        LanguageServiceDefaultsImpl.prototype.setModeConfiguration = function (modeConfiguration) {
            this._modeConfiguration = modeConfiguration || Object.create(null);
            this._onDidChange.fire(this);
        };
        LanguageServiceDefaultsImpl.prototype.setFormattingOptions = function (formattingOptions) {
            this._formattingOptions = formattingOptions || Object.create(null);
            this._onDidChange.fire(this);
        };
        return LanguageServiceDefaultsImpl;
    }());
    exports.LanguageServiceDefaultsImpl = LanguageServiceDefaultsImpl;
    exports.modeConfigurationDefault = {
        documentFormattingEdits: true,
        documentRangeFormattingEdits: false,
        completionItems: true,
        hovers: true,
        documentSymbols: false,
        tokens: false,
        colors: false,
        foldingRanges: false,
        diagnostics: true,
        selectionRanges: false,
    };
    exports.schemaDefault = {
        schema: 'http://localhost:8000',
        projects: [],
        documents: ['**.graphql'],
        schemaLoader: null,
    };
    exports.formattingDefaults = {
        prettierConfig: {
            tabsWidth: 5,
        },
    };
});
//# sourceMappingURL=defaults.js.map