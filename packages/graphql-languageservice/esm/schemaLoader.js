import { getIntrospectionQuery, buildClientSchema, buildASTSchema, } from 'graphql';
export const defaultSchemaLoader = async (schemaConfig) => {
    const { requestOpts, uri, introspectionOptions } = schemaConfig;
    const rawResult = await fetch(uri, {
        method: requestOpts?.method ?? 'post',
        body: JSON.stringify({
            query: getIntrospectionQuery(introspectionOptions),
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
export function buildSchemaFromResponse(response, buildSchemaOptions) {
    if (!response) {
        throw Error('Empty schema response');
    }
    if ('__schema' in response) {
        return buildClientSchema(response, buildSchemaOptions);
    }
    return buildASTSchema(response, buildSchemaOptions);
}
//# sourceMappingURL=schemaLoader.js.map