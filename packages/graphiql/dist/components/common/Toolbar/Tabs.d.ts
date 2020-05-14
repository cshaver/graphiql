import React from 'react';
import { ReactNodeLike } from '../../../types';
export declare type TabProps = {
    active: boolean;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export declare type TabsProps = {
    tabs: ReactNodeLike[];
    active: number;
    onChange?: (idx: number) => void;
    children?: ReactNodeLike[];
};
declare const Tabs: ({ tabs, active, onChange, children }: TabsProps) => JSX.Element;
export default Tabs;
//# sourceMappingURL=Tabs.d.ts.map