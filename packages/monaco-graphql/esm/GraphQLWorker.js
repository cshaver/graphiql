import { getRange, LanguageService, } from 'graphql-languageservice';
import { toGraphQLPosition, toMonacoRange, toMarkerData, toCompletion, } from './utils';
export class GraphQLWorker {
    constructor(ctx, createData) {
        this._ctx = ctx;
        const serviceConfig = {
            schemaConfig: createData.schemaConfig,
        };
        if (createData.schemaLoader) {
            serviceConfig.schemaLoader = createData.schemaLoader;
        }
        this._languageService = new LanguageService(serviceConfig);
        this._formattingOptions = createData.formattingOptions;
    }
    async getSchemaResponse(_uri) {
        return this._languageService.getSchemaResponse();
    }
    async loadSchema(_uri) {
        return this._languageService.getSchema();
    }
    async doValidation(uri) {
        const document = this._getTextDocument(uri);
        const graphqlDiagnostics = await this._languageService.getDiagnostics(uri, document);
        return graphqlDiagnostics.map(toMarkerData);
    }
    async doComplete(uri, position) {
        const document = this._getTextDocument(uri);
        const graphQLPosition = toGraphQLPosition(position);
        const suggestions = await this._languageService.getCompletion(uri, document, graphQLPosition);
        return suggestions.map(suggestion => toCompletion(suggestion, getRange({
            column: graphQLPosition.character + 1,
            line: graphQLPosition.line + 1,
        }, document)));
    }
    async doHover(uri, position) {
        const document = this._getTextDocument(uri);
        const graphQLPosition = toGraphQLPosition(position);
        const hover = await this._languageService.getHover(uri, document, graphQLPosition);
        return {
            content: hover,
            range: toMonacoRange(getRange({
                column: graphQLPosition.character,
                line: graphQLPosition.line,
            }, document)),
        };
    }
    async doFormat(text) {
        const prettierStandalone = await import('prettier/standalone');
        const prettierGraphqlParser = await import('prettier/parser-graphql');
        return prettierStandalone.format(text, {
            ...this._formattingOptions,
            parser: 'graphql',
            plugins: [prettierGraphqlParser],
        });
    }
    async doParse(text) {
        return this._languageService.parse(text);
    }
    _getTextDocument(_uri) {
        const models = this._ctx.getMirrorModels();
        if (models.length > 0) {
            return models[0].getValue();
        }
        return '';
    }
}
//# sourceMappingURL=GraphQLWorker.js.map