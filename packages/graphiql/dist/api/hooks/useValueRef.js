"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useValueRef(value) {
    var ref = react_1.useRef(value);
    react_1.useEffect(function () {
        ref.current = value;
    }, [value]);
    return ref;
}
exports.default = useValueRef;
//# sourceMappingURL=useValueRef.js.map