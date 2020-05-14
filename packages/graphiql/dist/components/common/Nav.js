"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var theme_ui_1 = require("theme-ui");
exports.NavItem = function (_a) {
    var active = _a.active, label = _a.label, children = _a.children;
    return (theme_ui_1.jsx("button", { "aria-label": label, sx: {
            color: active ? '#E10098' : '#8c8c8c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            willChange: 'transform',
            transition: 'transform .2s ease',
            '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
            },
            ':hover': {
                transform: 'scale(1.1)',
            },
            ':active': {
                transform: 'scale(.95)',
            },
        } }, children));
};
exports.Nav = function (_a) {
    var children = _a.children;
    return (theme_ui_1.jsx("nav", { sx: {
            display: 'grid',
            gridAutoFlow: 'row',
            gridAutoRows: '2em',
            fontSize: '3em',
        } }, children));
};
//# sourceMappingURL=Nav.js.map