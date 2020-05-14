"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonacoGraphQLApi {
    constructor({ accessor }) {
        this.worker = accessor;
    }
    async getSchema() {
        const langWorker = await this.worker();
        return langWorker.getSchemaResponse();
    }
    async parse(graphqlString) {
        const langWorker = await this.worker();
        return langWorker.doParse(graphqlString);
    }
}
exports.MonacoGraphQLApi = MonacoGraphQLApi;
//# sourceMappingURL=api.js.map