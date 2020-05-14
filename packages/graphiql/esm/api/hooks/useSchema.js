import { useSchemaContext } from '../providers/GraphiQLSchemaProvider';
export default function useSchema() {
    var schema = useSchemaContext().schema;
    return schema;
}
//# sourceMappingURL=useSchema.js.map