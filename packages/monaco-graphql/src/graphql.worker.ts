/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import type { worker as workerNamespace, languages } from 'monaco-editor';
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';

import { GraphQLWorker } from './GraphQLWorker';

self.onmessage = () => {
  try {
    // ignore the first message
    worker.initialize(
      (
        ctx: workerNamespace.IWorkerContext,
        createData: languages.graphql.ICreateData,
      ) => {
        return new GraphQLWorker(ctx, createData);
      },
    );
  } catch (err) {
    throw err;
  }
};
