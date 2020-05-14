var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React from 'react';
import { ExecuteButton } from './ExecuteButton';
import { ToolbarButton } from './ToolbarButton';
import { QueryEditor } from './QueryEditor';
import { VariableEditor } from './VariableEditor';
import { ResultViewer } from './ResultViewer';
import { DocExplorer } from './DocExplorer';
import { QueryHistory } from './QueryHistory';
import StorageAPI from '../utility/StorageAPI';
import find from '../utility/find';
import { fillLeafs } from '../utility/fillLeafs';
import { SchemaProvider, SchemaContext, } from '../api/providers/GraphiQLSchemaProvider';
import { EditorsProvider } from '../api/providers/GraphiQLEditorsProvider';
import { SessionProvider, SessionContext, } from '../api/providers/GraphiQLSessionProvider';
import { getFetcher } from '../api/common';
import { Provider, useThemeLayout } from './common/themes/provider';
import Tabs from './common/Toolbar/Tabs';
var DEFAULT_DOC_EXPLORER_WIDTH = 350;
var majorVersion = parseInt(React.version.slice(0, 2), 10);
if (majorVersion < 16) {
    throw Error([
        'GraphiQL 0.18.0 and after is not compatible with React 15 or below.',
        'If you are using a CDN source (jsdelivr, unpkg, etc), follow this example:',
        'https://github.com/graphql/graphiql/blob/master/examples/graphiql-cdn/index.html#L49',
    ].join('\n'));
}
export var GraphiQL = function (props) {
    if (!props.fetcher && !props.uri) {
        throw Error('fetcher or uri property are required');
    }
    var fetcher = getFetcher(props);
    return (React.createElement(EditorsProvider, null,
        React.createElement(SchemaProvider, { fetcher: fetcher, config: __assign({ uri: props.uri }, props.schemaConfig) },
            React.createElement(SessionProvider, { fetcher: fetcher, sessionId: 0 },
                React.createElement(GraphiQLInternals, __assign({}, __assign({ formatResult: formatResult,
                    formatError: formatError }, props)), props.children)))));
};
var formatResult = function (result) {
    return JSON.stringify(result, null, 2);
};
var formatError = function (rawError) {
    var result = Array.isArray(rawError)
        ? rawError.map(formatSingleError)
        : formatSingleError(rawError);
    return JSON.stringify(result, null, 2);
};
var GraphiQLInternals = (function (_super) {
    __extends(GraphiQLInternals, _super);
    function GraphiQLInternals(props) {
        var _this = _super.call(this, props) || this;
        _this._editorQueryID = 0;
        _this.handleClickReference = function (_reference) {
        };
        _this.handleStopQuery = function () {
            var subscription = _this.state.subscription;
            _this.setState({
                isWaitingForResponse: false,
                subscription: null,
            });
            if (subscription) {
                subscription.unsubscribe();
            }
        };
        _this.handlePrettifyQuery = function () {
        };
        _this.handleMergeQuery = function () {
        };
        _this.handleCopyQuery = function () {
        };
        _this.handleEditOperationName = function (operationName) {
            var onEditOperationName = _this.props.onEditOperationName;
            if (onEditOperationName) {
                onEditOperationName(operationName);
            }
        };
        _this.handleHintInformationRender = function (elem) {
            elem.addEventListener('click', _this._onClickHintInformation);
            var onRemoveFn;
            elem.addEventListener('DOMNodeRemoved', (onRemoveFn = function () {
                elem.removeEventListener('DOMNodeRemoved', onRemoveFn);
                elem.removeEventListener('click', _this._onClickHintInformation);
            }));
        };
        _this._onClickHintInformation = function (event) {
            if ((event === null || event === void 0 ? void 0 : event.currentTarget) &&
                'className' in event.currentTarget &&
                event.currentTarget.className === 'typeName') {
                var typeName = event.currentTarget.innerHTML;
                var schema = _this.context.schema;
                if (schema) {
                    var type = schema.getType(typeName);
                    if (type) {
                    }
                }
            }
        };
        _this.handleToggleDocs = function () {
            if (typeof _this.props.onToggleDocs === 'function') {
                _this.props.onToggleDocs(!_this.state.docExplorerOpen);
            }
            _this.setState({ docExplorerOpen: !_this.state.docExplorerOpen });
        };
        _this.handleToggleHistory = function () {
            if (typeof _this.props.onToggleHistory === 'function') {
                _this.props.onToggleHistory(!_this.state.historyPaneOpen);
            }
            _this.setState({ historyPaneOpen: !_this.state.historyPaneOpen });
        };
        _this.handleResetResize = function () {
            _this.setState({ editorFlex: 1 });
        };
        if (typeof props.fetcher !== 'function') {
            throw new TypeError('GraphiQL requires a fetcher function.');
        }
        _this._storage = new StorageAPI(props.storage);
        var docExplorerOpen = props.docExplorerOpen || false;
        if (_this._storage.get('docExplorerOpen')) {
            docExplorerOpen = _this._storage.get('docExplorerOpen') === 'true';
        }
        var variableEditorOpen = props.defaultVariableEditorOpen !== undefined
            ? props.defaultVariableEditorOpen
            : Boolean(props.variables);
        _this.state = {
            docExplorerOpen: docExplorerOpen,
            response: props.response,
            editorFlex: Number(_this._storage.get('editorFlex')) || 1,
            variableEditorOpen: variableEditorOpen,
            variableEditorHeight: Number(_this._storage.get('variableEditorHeight')) || 200,
            historyPaneOpen: _this._storage.get('historyPaneOpen') === 'true' || false,
            docExplorerWidth: Number(_this._storage.get('docExplorerWidth')) ||
                DEFAULT_DOC_EXPLORER_WIDTH,
            isWaitingForResponse: false,
            subscription: null,
        };
        if (typeof window === 'object') {
            window.addEventListener('beforeunload', function () {
                return _this.componentWillUnmount();
            });
        }
        return _this;
    }
    GraphiQLInternals.prototype.componentDidMount = function () {
        global.g = this;
    };
    GraphiQLInternals.prototype.componentWillUnmount = function () {
        var _a, _b, _c, _d;
        if ((_b = (_a = this.context) === null || _a === void 0 ? void 0 : _a.operation) === null || _b === void 0 ? void 0 : _b.text) {
            this._storage.set('query', this.context.operation.text);
        }
        if ((_d = (_c = this.context) === null || _c === void 0 ? void 0 : _c.variables) === null || _d === void 0 ? void 0 : _d.text) {
            this._storage.set('variables', this.context.variables.text);
        }
        if (this.state.operationName) {
            this._storage.set('operationName', this.state.operationName);
        }
        this._storage.set('editorFlex', JSON.stringify(this.state.editorFlex));
        this._storage.set('variableEditorHeight', JSON.stringify(this.state.variableEditorHeight));
        this._storage.set('docExplorerWidth', JSON.stringify(this.state.docExplorerWidth));
        this._storage.set('docExplorerOpen', JSON.stringify(this.state.docExplorerOpen));
        this._storage.set('historyPaneOpen', JSON.stringify(this.state.historyPaneOpen));
    };
    GraphiQLInternals.prototype.render = function () {
        var _this = this;
        var Layout = useThemeLayout();
        var children = React.Children.toArray(this.props.children);
        var logo = find(children, function (child) {
            return isChildComponentType(child, GraphiQLLogo);
        }) || React.createElement(GraphiQLLogo, null);
        var footer = find(children, function (child) {
            return isChildComponentType(child, GraphiQLFooter);
        });
        var SessionTabs = function (_a) {
            var name = _a.name, tabs = _a.tabs, c = _a.children;
            return (React.createElement(SessionContext.Consumer, null, function (session) {
                var _a;
                return (React.createElement(Tabs, { active: (_a = session === null || session === void 0 ? void 0 : session.currentTabs) === null || _a === void 0 ? void 0 : _a[name], tabs: tabs, onChange: function (tabId) { return session.changeTab(name, tabId); } }, c));
            }));
        };
        var operationEditor = (React.createElement("section", { "aria-label": "Operation Editor" },
            React.createElement(SessionTabs, { tabs: ["Operation", "Explorer"], name: "operation" },
                React.createElement(QueryEditor, { onHintInformationRender: this.handleHintInformationRender, onClickReference: this.handleClickReference, editorTheme: this.props.editorTheme, readOnly: this.props.readOnly, editorOptions: this.props.operationEditorOptions }),
                React.createElement("div", null, "Explorer"))));
        var variables = (React.createElement("section", { "aria-label": "Query Variables" },
            React.createElement(SessionTabs, { tabs: ["Variables", "Console"], name: "variables" },
                React.createElement(VariableEditor, { onHintInformationRender: this.handleHintInformationRender, onPrettifyQuery: this.handlePrettifyQuery, onMergeQuery: this.handleMergeQuery, editorTheme: this.props.editorTheme, readOnly: this.props.readOnly, editorOptions: this.props.variablesEditorOptions }),
                React.createElement("div", null, "Console"))));
        var response = (React.createElement("section", { "aria-label": "Response Editor" },
            React.createElement(SessionTabs, { tabs: ["Response", "Extensions", "Playground"], name: "results" },
                React.createElement(React.Fragment, null,
                    this.state.isWaitingForResponse && (React.createElement("div", { className: "spinner-container" },
                        React.createElement("div", { className: "spinner" }))),
                    React.createElement(ResultViewer, { editorTheme: this.props.editorTheme, editorOptions: this.props.resultsEditorOptions }),
                    footer),
                React.createElement("div", null, "Extensions"),
                React.createElement("div", null, "Playground"))));
        return (React.createElement(Provider, null,
            React.createElement(Layout, { nav: React.createElement(React.Fragment, null,
                    React.createElement(GraphiQLToolbar, null,
                        logo,
                        React.createElement(ExecuteButton, { isRunning: Boolean(this.state.subscription), onStop: this.handleStopQuery }),
                        React.createElement(ToolbarButton, { onClick: this.handlePrettifyQuery, title: "Prettify Query (Shift-Ctrl-P)", label: "Prettify" }),
                        React.createElement(ToolbarButton, { onClick: this.handleMergeQuery, title: "Merge Query (Shift-Ctrl-M)", label: "Merge" }),
                        React.createElement(ToolbarButton, { onClick: this.handleCopyQuery, title: "Copy Query (Shift-Ctrl-C)", label: "Copy" }),
                        React.createElement(ToolbarButton, { onClick: this.handleToggleHistory, title: "Show History", label: "History" }),
                        React.createElement(ToolbarButton, { onClick: this.handleToggleDocs, title: "Open Documentation Explorer", label: "Docs" }))), session: {
                    input: operationEditor,
                    response: response,
                    console: variables,
                }, navPanels: __spreadArrays((this.state.docExplorerOpen
                    ? [
                        {
                            key: 'docs',
                            size: 'sidebar',
                            component: (React.createElement(SchemaContext.Consumer, null, function (_a) {
                                var schema = _a.schema;
                                return React.createElement(DocExplorer, { schema: schema });
                            })),
                        },
                    ]
                    : []), (this.state.historyPaneOpen
                    ? [
                        {
                            key: 'history',
                            size: 'sidebar',
                            component: (React.createElement(SessionContext.Consumer, null, function (session) {
                                return (React.createElement(QueryHistory, { onSelectQuery: function (operation, vars, _opName) {
                                        if (operation) {
                                            session.changeOperation(operation);
                                        }
                                        if (vars) {
                                            session.changeVariables(vars);
                                        }
                                    }, storage: _this._storage, queryID: _this._editorQueryID },
                                    React.createElement("button", { className: "docExplorerHide", onClick: _this.handleToggleHistory, "aria-label": "Close History" }, '\u2715')));
                            })),
                        },
                    ]
                    : [])) })));
    };
    GraphiQLInternals.prototype.autoCompleteLeafs = function () {
        var _a;
        var _b = fillLeafs(this.context.schema, (_a = this.context) === null || _a === void 0 ? void 0 : _a.operation.text, this.props.getDefaultFieldNames), insertions = _b.insertions, result = _b.result;
        if (insertions && insertions.length > 0) {
            var editor_1 = this.getQueryEditor();
            if (editor_1) {
                editor_1.operation(function () {
                    var cursor = editor_1.getCursor();
                    var cursorIndex = editor_1.indexFromPos(cursor);
                    editor_1.setValue(result || '');
                    var added = 0;
                    var markers = insertions.map(function (_a) {
                        var index = _a.index, string = _a.string;
                        return editor_1.markText(editor_1.posFromIndex(index + added), editor_1.posFromIndex(index + (added += string.length)), {
                            className: 'autoInsertedLeaf',
                            clearOnEnter: true,
                            title: 'Automatically added leaf fields',
                        });
                    });
                    setTimeout(function () { return markers.forEach(function (marker) { return marker.clear(); }); }, 7000);
                    var newCursorIndex = cursorIndex;
                    insertions.forEach(function (_a) {
                        var index = _a.index, string = _a.string;
                        if (index < cursorIndex) {
                            newCursorIndex += string.length;
                        }
                    });
                    editor_1.setCursor(editor_1.posFromIndex(newCursorIndex));
                });
            }
        }
        return result;
    };
    return GraphiQLInternals;
}(React.Component));
function GraphiQLLogo(props) {
    return (React.createElement("div", { className: "title" }, props.children || (React.createElement("span", null,
        'Graph',
        React.createElement("em", null, 'i'),
        'QL'))));
}
GraphiQLLogo.displayName = 'GraphiQLLogo';
function GraphiQLToolbar(props) {
    return (React.createElement("div", { className: "toolbar", role: "toolbar", "aria-label": "Editor Commands" }, props.children));
}
GraphiQLToolbar.displayName = 'GraphiQLToolbar';
function GraphiQLFooter(props) {
    return React.createElement("div", { className: "footer" }, props.children);
}
GraphiQLFooter.displayName = 'GraphiQLFooter';
var formatSingleError = function (error) { return (__assign(__assign({}, error), { message: error.message, stack: error.stack })); };
function isChildComponentType(child, component) {
    var _a;
    if (((_a = child === null || child === void 0 ? void 0 : child.type) === null || _a === void 0 ? void 0 : _a.displayName) &&
        child.type.displayName === component.displayName) {
        return true;
    }
    return child.type === component;
}
//# sourceMappingURL=GraphiQL.js.map