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
Object.defineProperty(exports, "__esModule", { value: true });
var theme_ui_1 = require("theme-ui");
var NAV_WIDTH = '6em';
var CONTENT_MIN_WIDTH = '60em';
function sizeInCSSUnits(theme, size) {
    switch (size) {
        case 'sidebar':
            return '10em';
        case 'aside':
            return '20em';
        default:
            return "calc(100vw - " + theme.space[2] * 3 + "px - " + NAV_WIDTH + ")";
    }
}
var Card = function (_a) {
    var children = _a.children, size = _a.size, _b = _a.transparent, transparent = _b === void 0 ? false : _b, innerSx = _a.innerSx;
    return (theme_ui_1.jsx("div", { sx: __assign({ display: 'grid', backgroundColor: !transparent ? 'cardBackground' : undefined, boxShadow: !transparent && 'card', minWidth: size && (function (theme) { return sizeInCSSUnits(theme, size); }), gridTemplate: '100% / 100%' }, (innerSx !== null && innerSx !== void 0 ? innerSx : {})) }, children));
};
var gridBase = {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
    gridAutoRows: '100%',
    gap: 3,
};
var Layout = function (_a) {
    var nav = _a.nav, navPanels = _a.navPanels, session = _a.session;
    var hasNavPanels = (navPanels && (navPanels === null || navPanels === void 0 ? void 0 : navPanels.length) > 0) || false;
    return (theme_ui_1.jsx("main", { sx: __assign(__assign({}, gridBase), { padding: 3, gridTemplate: hasNavPanels
                ? "'nav panels session' 100% / " + NAV_WIDTH + " min-content minmax(" + CONTENT_MIN_WIDTH + ", 1fr)"
                : "'nav session' 100% / " + NAV_WIDTH + " minmax(" + CONTENT_MIN_WIDTH + ", 1fr)", height: '100%' }) },
        nav && (theme_ui_1.jsx(Card, { innerSx: { gridArea: 'nav' }, transparent: true }, nav)),
        hasNavPanels && (theme_ui_1.jsx("div", { sx: __assign({ gridArea: 'panels' }, gridBase) }, navPanels.map(function (_a) {
            var component = _a.component, key = _a.key, size = _a.size;
            return (theme_ui_1.jsx(Card, { key: key, size: size }, component));
        }))),
        session && (theme_ui_1.jsx("div", { sx: __assign(__assign({}, gridBase), { gridArea: 'session', gridAutoRows: '1fr', gridTemplateAreas: "'input response' 'console console'" }) },
            theme_ui_1.jsx(Card, { innerSx: { gridArea: 'input' } }, session.input),
            theme_ui_1.jsx(Card, { innerSx: { gridArea: 'response' } }, session.response),
            theme_ui_1.jsx(Card, { innerSx: { gridArea: 'console' } }, session.console)))));
};
exports.default = Layout;
//# sourceMappingURL=Layout.js.map