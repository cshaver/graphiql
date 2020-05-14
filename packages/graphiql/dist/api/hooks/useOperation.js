"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphiQLSessionProvider_1 = require("../providers/GraphiQLSessionProvider");
function useOperation() {
    var operation = GraphiQLSessionProvider_1.useSessionContext().operation;
    return operation;
}
exports.default = useOperation;
//# sourceMappingURL=useOperation.js.map