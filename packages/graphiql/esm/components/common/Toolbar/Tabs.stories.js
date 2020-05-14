import List, { ListRow } from '../List';
import Tabs from './Tabs';
import React, { useState } from 'react';
import { layout } from '../themes/decorators';
export default { title: 'Tabbar', decorators: [layout] };
var ManagedTabs = function (_a) {
    var tabs = _a.tabs, children = _a.children;
    var _b = useState(0), active = _b[0], setActive = _b[1];
    return (React.createElement(Tabs, { active: active, tabs: tabs, onChange: setActive }, children));
};
export var Tabbar = function () { return (React.createElement(List, null,
    React.createElement(ListRow, null,
        React.createElement(ManagedTabs, { tabs: ['One', 'Two', 'Three'] },
            React.createElement("p", null, 'One'),
            React.createElement("p", null, 'Two'),
            React.createElement("p", null, 'Three'))),
    React.createElement(ListRow, null,
        React.createElement(ManagedTabs, { tabs: [
                'With',
                'a',
                'nested',
                React.createElement(React.Fragment, null,
                    'Component ',
                    React.createElement("small", { style: { background: 'yellow', padding: 3 } }, '2')),
            ] },
            React.createElement("p", null, 'With'),
            React.createElement("p", null, 'a'),
            React.createElement("p", null, 'nested'),
            React.createElement("p", null, 'component'))),
    React.createElement(ListRow, { flex: true },
        React.createElement("div", { style: { height: '100px', display: 'grid' } },
            React.createElement(ManagedTabs, { tabs: ['Very tall', 'tabs'] },
                React.createElement("p", null, 'a'),
                React.createElement("p", null, 'b')))))); };
//# sourceMappingURL=Tabs.stories.js.map