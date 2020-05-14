import { jsx } from 'theme-ui';
import { NavItem, Nav } from './Nav';
import { layout } from './themes/decorators';
import Logo from './Logo';
export default { title: 'Navbar', decorators: [layout] };
export var NavBar = function () { return (jsx(Nav, null,
    jsx(NavItem, { label: "Schema" },
        jsx(Logo, { size: "1em" })),
    jsx(NavItem, { label: "Pig\u2019s nose" }, '🐽'),
    jsx(NavItem, { label: "Farmer" }, '👨‍🌾'),
    jsx(NavItem, { label: "Bee" }, '🐝'))); };
//# sourceMappingURL=Nav.stories.js.map