import { useSessionContext } from '../providers/GraphiQLSessionProvider';
export default function useOperation() {
    var operation = useSessionContext().operation;
    return operation;
}
//# sourceMappingURL=useOperation.js.map