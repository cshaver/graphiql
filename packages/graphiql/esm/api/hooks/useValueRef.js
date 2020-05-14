import { useEffect, useRef } from 'react';
export default function useValueRef(value) {
    var ref = useRef(value);
    useEffect(function () {
        ref.current = value;
    }, [value]);
    return ref;
}
//# sourceMappingURL=useValueRef.js.map