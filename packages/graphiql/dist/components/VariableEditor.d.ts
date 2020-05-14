import { GraphQLType } from 'graphql';
import type { EditorOptions } from '../types';
export declare type VariableEditorProps = {
    variableToType?: {
        [variable: string]: GraphQLType;
    };
    value?: string;
    readOnly?: boolean;
    onHintInformationRender: (value: HTMLDivElement) => void;
    onPrettifyQuery: (value?: string) => void;
    onMergeQuery: (value?: string) => void;
    editorTheme?: string;
    editorOptions?: EditorOptions;
};
export declare function VariableEditor(props: VariableEditorProps): JSX.Element;
//# sourceMappingURL=VariableEditor.d.ts.map