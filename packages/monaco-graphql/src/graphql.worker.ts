/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import { worker as WorkerNamespace } from 'monaco-editor';
// @ts-ignore
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';

/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import type { editor, languages, Position, IRange } from 'monaco-editor';

import {
  getRange,
  CompletionItem as GraphQLCompletionItem,
  LanguageService,
} from 'graphql-languageservice';

import {
  toGraphQLPosition,
  toMonacoRange,
  toMarkerData,
  toCompletion,
} from './utils';

export type MonacoCompletionItem = languages.CompletionItem & {
  isDeprecated?: boolean;
  deprecationReason?: string | null;
};

export class GraphQLWorker {
  private _ctx: worker.IWorkerContext;
  private _languageService: LanguageService;
  constructor(
    ctx: worker.IWorkerContext,
    createData: monaco.languages.graphql.ICreateData,
  ) {
    this._ctx = ctx;
    this._languageService = new LanguageService({ uri: createData.schemaUrl });
  }
  async getSchema() {
    return this._languageService.getSchema();
  }
  async doValidation(uri: string): Promise<editor.IMarkerData[]> {
    const document = this._getTextDocument(uri);
    const graphqlDiagnostics = await this._languageService.getDiagnostics(
      uri,
      document,
    );
    return graphqlDiagnostics.map(toMarkerData);
  }

  async doComplete(
    uri: string,
    position: Position,
  ): Promise<(GraphQLCompletionItem & { range: IRange })[]> {
    const document = this._getTextDocument(uri);
    const graphQLPosition = toGraphQLPosition(position);
    const suggestions = await this._languageService.getCompletion(
      uri,
      document,
      graphQLPosition,
    );

    return suggestions.map(suggestion =>
      toCompletion(
        suggestion,
        getRange(
          {
            column: graphQLPosition.character + 1,
            line: graphQLPosition.line + 1,
          },
          document,
        ),
      ),
    );
  }

  async doHover(uri: string, position: Position) {
    const document = this._getTextDocument(uri);
    const graphQLPosition = toGraphQLPosition(position);

    const hover = await this._languageService.getHover(
      uri,
      document,
      graphQLPosition,
    );

    return {
      content: hover,
      range: toMonacoRange(
        getRange(
          {
            column: graphQLPosition.character + 1,
            line: graphQLPosition.line + 1,
          },
          document,
        ),
      ),
    };
  }
  async doFormat(text: string): Promise<string> {
    const prettierStandalone = await import('prettier/standalone');
    const prettierGraphqlParser = await import('prettier/parser-graphql');

    return prettierStandalone.format(text, {
      parser: 'graphql',
      plugins: [prettierGraphqlParser],
    });
  }

  private _getTextDocument(_uri: string): string {
    const models = this._ctx.getMirrorModels();
    if (models.length > 0) {
      return models[0].getValue();
    }
    return '';
  }
}

self.onmessage = () => {
  try {
    // ignore the first message
    worker.initialize(
      (
        ctx: WorkerNamespace.IWorkerContext,
        createData: monaco.languages.graphql.ICreateData,
      ) => {
        return new GraphQLWorker(ctx, createData);
      },
    );
  } catch (err) {
    throw err;
  }
};
