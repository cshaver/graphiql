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
import { jsx } from 'theme-ui';
import { Nav, NavItem } from './Nav';
import List, { ListRow } from './List';
import { useThemeLayout } from './themes/provider';
import Logo from './Logo';
var explorer = {
    input: (jsx(List, null,
        jsx(ListRow, null, 'Input'))),
    response: (jsx(List, null,
        jsx(ListRow, null, 'Response'))),
    console: (jsx(List, null,
        jsx(ListRow, null, 'Console/Inspector'))),
};
var nav = (jsx(Nav, null,
    jsx(NavItem, { label: "Schema" },
        jsx(Logo, { size: "1em" })),
    jsx(NavItem, { label: "Pig\u2019s nose" }, '🐽'),
    jsx(NavItem, { label: "Farmer" }, '👨‍🌾'),
    jsx(NavItem, { label: "Bee" }, '🐝')));
var slots = { nav: nav, explorer: explorer };
export default { title: 'Layout' };
export var WithSlots = function () {
    var Layout = useThemeLayout();
    return jsx(Layout, __assign({}, slots));
};
export var WithManySidebars = function () {
    var Layout = useThemeLayout();
    return (jsx(Layout, __assign({}, slots, { navPanels: [
            {
                key: 1,
                size: 'sidebar',
                component: (jsx(List, null,
                    jsx(ListRow, null, 'Sidebar'))),
            },
            {
                key: 2,
                size: 'aside',
                component: (jsx(List, null,
                    jsx(ListRow, null, 'aside'))),
            },
            {
                key: 3,
                size: 'aside',
                component: (jsx(List, null,
                    jsx(ListRow, null, 'Another aside'))),
            },
        ] })));
};
export var WithFullScreenPanel = function () {
    var Layout = useThemeLayout();
    return (jsx(Layout, __assign({}, slots, { navPanels: [
            {
                key: 1,
                size: 'full-screen',
                component: (jsx(List, null,
                    jsx(ListRow, null, 'Woooo'))),
            },
        ] })));
};
export var WithStringsOnly = function () {
    var Layout = useThemeLayout();
    return (jsx(Layout, __assign({}, {
        explorer: {
            input: 'input',
            response: 'response',
            console: 'console',
        },
        nav: 'nav',
        navPanels: [
            {
                component: 'sidebar',
                key: 'sidebar',
                size: 'sidebar',
            },
        ],
    })));
};
//# sourceMappingURL=Layout.stories.js.map