import { PropsWithChildren } from 'react';
import { ReactNodeLike } from '../../types';
interface NavProps {
    children: Array<ReactNodeLike>;
}
interface NavItemProps {
    label: string;
    active?: boolean;
}
export declare const NavItem: ({ active, label, children, }: PropsWithChildren<NavItemProps>) => JSX.Element;
export declare const Nav: ({ children }: NavProps) => JSX.Element;
export {};
//# sourceMappingURL=Nav.d.ts.map