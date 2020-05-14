"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Layout_1 = __importDefault(require("./Layout"));
exports.Layout = Layout_1.default;
var palette = {
    neutral: {
        20: '#999999',
        70: '#333333',
        90: "rgba(0, 0, 0, 0.1)",
        100: '#fff',
    },
    fuchsia: {
        90: 'rgba(254, 247, 252, 0.940177)',
        50: '#E535AB',
    },
};
var colors = {
    text: palette.neutral[20],
    darkText: palette.neutral[70],
    background: palette.fuchsia[90],
    cardBackground: palette.neutral[100],
    primary: palette.fuchsia[50],
    border: palette.neutral[90],
};
var space = [0, 5, 10, 15, 20];
var fontSizes = [12, 16, 20];
var theme = {
    fonts: {
        body: 'system-ui, sans-serif',
        heading: '"Avenir Next", sans-serif',
        monospace: 'Menlo, monospace',
    },
    fontSizes: fontSizes,
    space: space,
    colors: colors,
    transitions: ['.25s'],
    spaces: {
        rowPadding: space[3],
        rowMinHeight: space[3] + fontSizes[1] + space[3],
    },
    shadows: {
        card: "0 0 0 .1px " + colors.border + ", 0 1px 4px 0 " + colors.border,
        primaryUnderline: "inset 0 -4px 0 0 " + colors.primary,
        underline: "inset 0 -4px 0 0 " + colors.border,
    },
};
exports.theme = theme;
//# sourceMappingURL=index.js.map