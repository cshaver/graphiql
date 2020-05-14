import 'regenerator-runtime/runtime';
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import { GraphQLWorker } from 'monaco-graphql/esm/GraphQLWorker';
self.onmessage = function () {
    try {
        worker.initialize(function (ctx, createData) {
            return new GraphQLWorker(ctx, createData);
        });
    }
    catch (err) {
        throw err;
    }
};
//# sourceMappingURL=graphql.worker.js.map