import { useMemo } from 'react';
import getQueryFacts from '../../utility/getQueryFacts';
import useSchema from './useSchema';
import useOperation from './useOperation';
export default function useQueryFacts() {
    var schema = useSchema();
    var text = useOperation().text;
    return useMemo(function () { return (schema ? getQueryFacts(schema, text) : null); }, [
        schema,
        text,
    ]);
}
//# sourceMappingURL=useQueryFacts.js.map