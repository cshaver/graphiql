import { GraphQLType } from 'graphql';
import type { EditorOptions } from '../types';
export declare type QueryEditorProps = {
    onEdit?: (value: string) => void;
    readOnly?: boolean;
    onHintInformationRender: (elem: HTMLDivElement) => void;
    onClickReference?: (reference: GraphQLType) => void;
    editorTheme?: string;
    operation?: string;
    editorOptions?: EditorOptions;
};
export declare function QueryEditor(props: QueryEditorProps): JSX.Element;
//# sourceMappingURL=QueryEditor.d.ts.map