"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker = __importStar(require("monaco-editor/esm/vs/editor/editor.worker"));
const GraphQLWorker_1 = require("./GraphQLWorker");
self.onmessage = () => {
    try {
        worker.initialize((ctx, createData) => {
            console.log({ createData });
            return new GraphQLWorker_1.GraphQLWorker(ctx, createData);
        });
    }
    catch (err) {
        throw err;
    }
};
//# sourceMappingURL=graphql.worker.js.map