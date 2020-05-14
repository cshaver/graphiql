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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var theme_ui_1 = require("theme-ui");
var WithDividers_1 = __importDefault(require("./support/WithDividers"));
var Tab = function (_a) {
    var active = _a.active, props = __rest(_a, ["active"]);
    return (theme_ui_1.jsx("button", __assign({ sx: {
            padding: function (_a) {
                var spaces = _a.spaces;
                return spaces.rowPadding;
            },
            outline: 'none',
            textAlign: 'end',
            verticalAlign: 'baseline',
            transition: function (_a) {
                var transitions = _a.transitions;
                return transitions[0];
            },
            cursor: 'pointer',
            ':focus, :hover': {
                boxShadow: active ? 'primaryUnderline' : 'underline',
                color: active ? 'primary' : 'darkText',
            },
            boxShadow: active ? 'primaryUnderline' : 'inset 0 0 0 transparent',
            color: active ? 'primary' : 'text',
        } }, props)));
};
var Tabs = function (_a) {
    var tabs = _a.tabs, active = _a.active, onChange = _a.onChange, children = _a.children;
    return (theme_ui_1.jsx(react_1.default.Fragment, null,
        theme_ui_1.jsx(WithDividers_1.default, null, tabs.map(function (tab, index) { return (theme_ui_1.jsx(Tab, { key: index, active: active === index, onClick: function () { return onChange === null || onChange === void 0 ? void 0 : onChange(index); } }, tab)); })),
        children && children[active]));
};
exports.default = Tabs;
//# sourceMappingURL=Tabs.js.map