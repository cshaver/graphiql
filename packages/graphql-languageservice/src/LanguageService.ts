/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import { parse, GraphQLSchema, ParseOptions } from 'graphql';
import type { Position } from 'graphql-language-service-types';
import {
  getAutocompleteSuggestions,
  getDiagnostics,
  getHoverInformation,
} from 'graphql-language-service-interface';

type LSPConfig = {
  uri: string;
  parser?: typeof parse;
  schemaLoader?: typeof defaultSchemaLoader;
};
import { defaultSchemaLoader } from './schemaLoader';

export class LanguageService {
  private _parser: typeof parse;
  private _uri: string;
  private _schema: GraphQLSchema | null;
  private _schemaLoader: typeof defaultSchemaLoader;

  constructor({ uri, parser, schemaLoader }: LSPConfig) {
    this._uri = uri;
    this._parser = parser || parse;
    this._schema = null;
    this._schemaLoader = schemaLoader || defaultSchemaLoader;
  }

  public get schema() {
    return this._schema as GraphQLSchema;
  }

  async getSchema() {
    if (this.schema) {
      return this.schema;
    }
    return this.loadSchema();
  }

  async loadSchema() {
    if (!this._uri) {
      throw new Error('uri missing');
    }
    const schema = await this._schemaLoader({ uri: this._uri });
    return schema as GraphQLSchema;
  }

  async parse(text: string, options?: ParseOptions) {
    return this._parser(text, options);
  }

  getCompletion = async (
    _uri: string,
    documentText: string,
    position: Position,
  ) =>
    getAutocompleteSuggestions(await this.getSchema(), documentText, position);

  getDiagnostics = async (_uri: string, documentText: string) =>
    getDiagnostics(documentText, await this.getSchema());

  getHover = async (_uri: string, documentText: string, position: Position) =>
    getHoverInformation(await this.getSchema(), documentText, position);
}
