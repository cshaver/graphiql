var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "monaco-editor/esm/vs/editor/editor.worker", "./GraphQLWorker"], function (require, exports, worker, GraphQLWorker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    worker = __importStar(worker);
    self.onmessage = function () {
        try {
            worker.initialize(function (ctx, createData) {
                console.log({ createData: createData });
                return new GraphQLWorker_1.GraphQLWorker(ctx, createData);
            });
        }
        catch (err) {
            throw err;
        }
    };
});
//# sourceMappingURL=graphql.worker.js.map