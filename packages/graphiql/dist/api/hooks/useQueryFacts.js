"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var getQueryFacts_1 = __importDefault(require("../../utility/getQueryFacts"));
var useSchema_1 = __importDefault(require("./useSchema"));
var useOperation_1 = __importDefault(require("./useOperation"));
function useQueryFacts() {
    var schema = useSchema_1.default();
    var text = useOperation_1.default().text;
    return react_1.useMemo(function () { return (schema ? getQueryFacts_1.default(schema, text) : null); }, [
        schema,
        text,
    ]);
}
exports.default = useQueryFacts;
//# sourceMappingURL=useQueryFacts.js.map