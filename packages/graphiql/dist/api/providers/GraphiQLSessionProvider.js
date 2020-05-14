"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var GraphiQLSchemaProvider_1 = require("./GraphiQLSchemaProvider");
var GraphiQLEditorsProvider_1 = require("./GraphiQLEditorsProvider");
var sessionActions_1 = require("../actions/sessionActions");
var observableToPromise_1 = require("../../utility/observableToPromise");
exports.initialState = {
    sessionId: 0,
    operation: { uri: 'graphql://graphiql/operations/0.graphql' },
    variables: { uri: 'graphql://graphiql/variables/0.graphql' },
    results: { uri: 'graphql://graphiql/results/0.graphql' },
    currentTabs: {
        operation: 0,
        variables: 0,
        results: 0,
    },
    operationLoading: true,
    operationErrors: null,
    operations: [],
    editors: {},
};
exports.initialContextState = __assign({ executeOperation: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2];
    }); }); }, changeOperation: function () { return null; }, changeVariables: function () { return null; }, changeTab: function () { return null; }, operationError: function () { return null; }, dispatch: function () { return null; } }, exports.initialState);
exports.SessionContext = React.createContext(exports.initialContextState);
exports.useSessionContext = function () { return React.useContext(exports.SessionContext); };
var sessionReducer = function (state, action) {
    var _a;
    switch (action.type) {
        case sessionActions_1.SessionActionTypes.OperationRequested:
            return __assign(__assign({}, state), { operationLoading: true });
        case sessionActions_1.SessionActionTypes.OperationChanged: {
            var value = action.payload.value;
            return __assign(__assign({}, state), { operation: __assign(__assign({}, state.operation), { text: value }) });
        }
        case sessionActions_1.SessionActionTypes.VariablesChanged: {
            var value = action.payload.value;
            return __assign(__assign({}, state), { variables: __assign(__assign({}, state.variables), { text: value }) });
        }
        case sessionActions_1.SessionActionTypes.OperationSucceeded: {
            var result = action.payload.result;
            return __assign(__assign({}, state), { results: __assign(__assign({}, state.results), { text: JSON.stringify(result, null, 2) }), operationErrors: null });
        }
        case sessionActions_1.SessionActionTypes.OperationErrored: {
            var error = action.payload.error;
            return __assign(__assign({}, state), { operationErrors: state.operationErrors
                    ? __spreadArrays(state.operationErrors, [error]) : [error] });
        }
        case sessionActions_1.SessionActionTypes.TabChanged: {
            var _b = action.payload, pane = _b.pane, tabId = _b.tabId;
            return __assign(__assign({}, state), { currentTabs: __assign(__assign({}, state.currentTabs), (_a = {}, _a[pane] = tabId, _a)) });
        }
        default: {
            return state;
        }
    }
};
function SessionProvider(_a) {
    var _this = this;
    var sessionId = _a.sessionId, fetcher = _a.fetcher, session = _a.session, children = _a.children;
    var schemaState = React.useContext(GraphiQLSchemaProvider_1.SchemaContext);
    var editorsState = React.useContext(GraphiQLEditorsProvider_1.EditorContext);
    var _b = React.useReducer(sessionReducer, exports.initialState), state = _b[0], dispatch = _b[1];
    var operationError = React.useCallback(function (error) { return dispatch(sessionActions_1.operationErroredAction(error, sessionId)); }, [dispatch, sessionId]);
    var changeOperation = React.useCallback(function (operationText) {
        return dispatch(sessionActions_1.operationChangedAction(operationText, sessionId));
    }, [dispatch, sessionId]);
    var changeVariables = React.useCallback(function (variablesText) {
        return dispatch(sessionActions_1.variableChangedAction(variablesText, sessionId));
    }, [dispatch, sessionId]);
    var changeTab = React.useCallback(function (pane, tabId) { return dispatch(sessionActions_1.tabChangedAction(pane, tabId)); }, [dispatch]);
    var executeOperation = React.useCallback(function (operationName) { return __awaiter(_this, void 0, void 0, function () {
        var _a, op, vars, operation, variables, fetchValues, result, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    dispatch(sessionActions_1.operationRequestAction());
                    _a = editorsState.editors, op = _a.operation, vars = _a.variables;
                    operation = op.editor.getValue();
                    variables = vars.editor.getValue();
                    fetchValues = {
                        query: operation !== null && operation !== void 0 ? operation : '',
                    };
                    if (variables && variables !== '{}') {
                        fetchValues.variables = variables;
                    }
                    if (operationName) {
                        fetchValues.operationName = operationName;
                    }
                    return [4, observableToPromise_1.observableToPromise(fetcher(fetchValues))];
                case 1:
                    result = _b.sent();
                    dispatch(sessionActions_1.operationSucceededAction(result, sessionId));
                    return [3, 3];
                case 2:
                    err_1 = _b.sent();
                    console.error(err_1.name, err_1.stack);
                    operationError(err_1);
                    return [3, 3];
                case 3: return [2];
            }
        });
    }); }, [
        dispatch,
        fetcher,
        operationError,
        schemaState.config,
        sessionId,
        editorsState.editors,
    ]);
    React.useEffect(function () {
        if (editorsState.editors.operation) {
            editorsState.editors.operation.editor.addAction({
                id: 'run-command',
                label: 'Run Operation',
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                run: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2, executeOperation()];
                    });
                }); },
            });
        }
    }, [editorsState.editors.operation, executeOperation]);
    return (React.createElement(exports.SessionContext.Provider, { value: __assign(__assign(__assign({}, state), session), { executeOperation: executeOperation,
            changeOperation: changeOperation,
            changeVariables: changeVariables,
            changeTab: changeTab,
            operationError: operationError,
            dispatch: dispatch }) }, children));
}
exports.SessionProvider = SessionProvider;
//# sourceMappingURL=GraphiQLSessionProvider.js.map