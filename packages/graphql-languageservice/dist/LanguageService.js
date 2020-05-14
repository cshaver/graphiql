"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_language_service_interface_1 = require("graphql-language-service-interface");
const schemaLoader_1 = require("./schemaLoader");
class LanguageService {
    constructor({ parser, schemaLoader, schemaConfig }) {
        this._parser = graphql_1.parse;
        this._schema = null;
        this._schemaResponse = null;
        this._schemaLoader = schemaLoader_1.defaultSchemaLoader;
        this.getCompletion = async (_uri, documentText, position) => graphql_language_service_interface_1.getAutocompleteSuggestions(await this.getSchema(), documentText, position);
        this.getDiagnostics = async (_uri, documentText, customRules) => graphql_language_service_interface_1.getDiagnostics(documentText, await this.getSchema(), customRules);
        this.getHover = async (_uri, documentText, position) => graphql_language_service_interface_1.getHoverInformation(await this.getSchema(), documentText, position);
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
        this._schema = schemaLoader_1.buildSchemaFromResponse(schemaResponse, this._schemaConfig.buildSchemaOptions);
        return this._schema;
    }
    async parse(text, options) {
        return this._parser(text, options);
    }
}
exports.LanguageService = LanguageService;
//# sourceMappingURL=LanguageService.js.map