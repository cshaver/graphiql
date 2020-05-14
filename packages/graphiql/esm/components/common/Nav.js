import { jsx } from 'theme-ui';
export var NavItem = function (_a) {
    var active = _a.active, label = _a.label, children = _a.children;
    return (jsx("button", { "aria-label": label, sx: {
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
export var Nav = function (_a) {
    var children = _a.children;
    return (jsx("nav", { sx: {
            display: 'grid',
            gridAutoFlow: 'row',
            gridAutoRows: '2em',
            fontSize: '3em',
        } }, children));
};
//# sourceMappingURL=Nav.js.map