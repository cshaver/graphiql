import { parse } from 'graphql';
import { getAutocompleteSuggestions, getDiagnostics, getHoverInformation, } from 'graphql-language-service-interface';
import { defaultSchemaLoader, buildSchemaFromResponse, } from './schemaLoader';
export class LanguageService {
    constructor({ parser, schemaLoader, schemaConfig }) {
        this._parser = parse;
        this._schema = null;
        this._schemaResponse = null;
        this._schemaLoader = defaultSchemaLoader;
        this.getCompletion = async (_uri, documentText, position) => getAutocompleteSuggestions(await this.getSchema(), documentText, position);
        this.getDiagnostics = async (_uri, documentText, customRules) => getDiagnostics(documentText, await this.getSchema(), customRules);
        this.getHover = async (_uri, documentText, position) => getHoverInformation(await this.getSchema(), documentText, position);
        this._schemaConfig = schemaConfig;
        if (parser) {
            this._parser = parser;
        }
        if (schemaLoader) {
            this._schemaLoader = schemaLoader;
        }
    }
    get schema() {
        return this._schema;
    }
    async getSchema() {
        if (this.schema) {
            return this.schema;
        }
        return this.loadSchema();
    }
    async getSchemaResponse() {
        if (this._schemaResponse) {
            return this._schemaResponse;
        }
        return this.loadSchemaResponse();
    }
    async loadSchemaResponse() {
        if (!this._schemaConfig?.uri) {
            throw new Error('uri missing');
        }
        this._schemaResponse = (await this._schemaLoader(this._schemaConfig));
        return this._schemaResponse;
    }
    async loadSchema() {
        const schemaResponse = await this.loadSchemaResponse();
        this._schema = buildSchemaFromResponse(schemaResponse, this._schemaConfig.buildSchemaOptions);
        return this._schema;
    }
    async parse(text, options) {
        return this._parser(text, options);
    }
}
//# sourceMappingURL=LanguageService.js.map