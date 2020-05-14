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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { useCallback } from 'react';
import { buildSchemaFromResponse } from 'graphql-languageservice';
import { SchemaActionTypes, schemaRequestedAction, schemaSucceededAction, schemaErroredAction, } from '../actions/schemaActions';
export var initialReducerState = {
    isLoading: false,
    config: { uri: '' },
    schema: null,
    errors: null,
};
export var getInitialState = function (initialState) { return (__assign(__assign({}, initialReducerState), initialState)); };
export var SchemaContext = React.createContext(__assign(__assign({}, getInitialState()), { loadCurrentSchema: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, undefined];
    }); }); }, dispatch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2, undefined];
    }); }); } }));
export var useSchemaContext = function () { return React.useContext(SchemaContext); };
export var schemaReducer = function (state, action) {
    switch (action.type) {
        case SchemaActionTypes.SchemaChanged:
            return __assign(__assign({}, state), { isLoading: true, config: action.payload });
        case SchemaActionTypes.SchemaRequested:
            return __assign(__assign({}, state), { isLoading: true });
        case SchemaActionTypes.SchemaSucceeded:
            return __assign(__assign({}, state), { isLoading: false, schema: action.payload });
        case SchemaActionTypes.SchemaErrored:
            return __assign(__assign({}, state), { isLoading: false, errors: state.errors
                    ? __spreadArrays(state.errors, [action.payload]) : [action.payload] });
        default: {
            return state;
        }
    }
};
export function SchemaProvider(_a) {
    var _this = this;
    var _b = _a.config, userSchemaConfig = _b === void 0 ? initialReducerState.config : _b, fetcher = _a.fetcher, props = __rest(_a, ["config", "fetcher"]);
    var _c = React.useReducer(schemaReducer, getInitialState({ config: userSchemaConfig })), state = _c[0], dispatch = _c[1];
    var loadCurrentSchema = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var schema, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    dispatch(schemaRequestedAction());
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 4, , 5]);
                    if (!((_c = (_b = (_a = monaco === null || monaco === void 0 ? void 0 : monaco.languages) === null || _a === void 0 ? void 0 : _a.graphql) === null || _b === void 0 ? void 0 : _b.api) === null || _c === void 0 ? void 0 : _c.getSchema)) return [3, 3];
                    return [4, monaco.languages.graphql.api.getSchema()];
                case 2:
                    schema = _d.sent();
                    console.log('schema fetched');
                    dispatch(schemaSucceededAction(buildSchemaFromResponse(schema)));
                    _d.label = 3;
                case 3: return [3, 5];
                case 4:
                    error_1 = _d.sent();
                    console.error(error_1);
                    dispatch(schemaErroredAction(error_1));
                    return [3, 5];
                case 5: return [2];
            }
        });
    }); }, [dispatch]);
    React.useEffect(function () {
        var _a, _b;
        if (state.config) {
            (_b = (_a = monaco === null || monaco === void 0 ? void 0 : monaco.languages) === null || _a === void 0 ? void 0 : _a.graphql) === null || _b === void 0 ? void 0 : _b.graphqlDefaults.setSchemaConfig(state.config);
        }
        setTimeout(function () {
            loadCurrentSchema()
                .then(function () {
                console.log('completed');
            })
                .catch(function (err) { return console.error(err); });
        }, 200);
    }, [state.config, loadCurrentSchema]);
    return (React.createElement(SchemaContext.Provider, { value: __assign(__assign({}, state), { loadCurrentSchema: loadCurrentSchema,
            dispatch: dispatch }) }, props.children));
}
//# sourceMappingURL=GraphiQLSchemaProvider.js.map