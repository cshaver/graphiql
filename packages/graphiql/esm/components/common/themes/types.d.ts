import { Maybe, ReactNodeLike } from '../../../types';
export declare type Color = string;
export declare type Colors = {
    text: Color;
    darkText: Color;
    background: Color;
    cardBackground: Color;
    primary: Color;
    border: Color;
};
export declare type FontSizes = number[];
export declare type Spaces = {
    rowPadding: number;
    rowMinHeight: number;
};
declare type Shadow = string;
export declare type Shadows = {
    card: Shadow;
    primaryUnderline: Shadow;
    underline: Shadow;
};
export declare type Font = string;
export declare type Fonts = {
    body: Font;
    heading: Font;
    monospace: Font;
};
export declare type Space = number[];
export declare type GraphiQLTheme = {
    fonts: Fonts;
    fontSizes: number[];
    colors: Colors;
    transitions: string[];
    space: Space;
    spaces: Spaces;
    shadows: Shadows;
};
export declare type PanelSize = 'sidebar' | 'aside' | 'full-screen';
export declare type LayoutPropTypes = {
    session?: {
        input?: ReactNodeLike;
        response?: ReactNodeLike;
        console?: ReactNodeLike;
    };
    nav: ReactNodeLike;
    navPanels?: Maybe<{
        component?: ReactNodeLike;
        key?: string | number;
        size?: PanelSize;
    }[]>;
};
export {};
//# sourceMappingURL=types.d.ts.map