export class MonacoGraphQLApi {
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
//# sourceMappingURL=api.js.map