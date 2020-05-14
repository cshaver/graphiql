"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GraphiQLSchemaProvider_1 = require("../providers/GraphiQLSchemaProvider");
function useSchema() {
    var schema = GraphiQLSchemaProvider_1.useSchemaContext().schema;
    return schema;
}
exports.default = useSchema;
//# sourceMappingURL=useSchema.js.map