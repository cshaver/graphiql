"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.defaultSchemaLoader = async (schemaConfig) => {
    const { requestOpts, uri, introspectionOptions } = schemaConfig;
    const rawResult = await fetch(uri, {
        method: requestOpts?.method ?? 'post',
        body: JSON.stringify({
            query: graphql_1.getIntrospectionQuery(introspectionOptions),
            operationName: 'IntrospectionQuery',
        }),
        credentials: 'omit',
        headers: requestOpts?.headers || {
            'Content-Type': 'application/json',
        },
        ...requestOpts,
    });
    const introspectionResponse = await rawResult.json();
    return introspectionResponse?.data;
};
function buildSchemaFromResponse(response, buildSchemaOptions) {
    if (!response) {
        throw Error('Empty schema response');
    }
    if ('__schema' in response) {
        return graphql_1.buildClientSchema(response, buildSchemaOptions);
    }
    return graphql_1.buildASTSchema(response, buildSchemaOptions);
}
exports.buildSchemaFromResponse = buildSchemaFromResponse;
//# sourceMappingURL=schemaLoader.js.map