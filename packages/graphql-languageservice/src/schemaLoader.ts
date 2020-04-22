import {
  GraphQLSchema,
  buildClientSchema,
  getIntrospectionQuery,
} from 'graphql';

export type SchemaConfig = {
  uri: string;
  assumeValid?: boolean;
};

export const defaultSchemaLoader = async (
  schemaConfig: SchemaConfig,
): Promise<GraphQLSchema | void> => {
  const rawResult = await fetch(schemaConfig.uri, {
    method: 'post',
    body: JSON.stringify({
      query: getIntrospectionQuery(),
      operationName: 'IntrospectionQuery',
    }),
    headers: { 'Content-Type': 'application/json', credentials: 'omit' },
  });

  const introspectionResponse = await rawResult.json();

  if (!introspectionResponse || !introspectionResponse.data) {
    throw Error(`error fetching introspection schema for ${schemaConfig.uri}`);
  }
  return buildClientSchema(introspectionResponse.data, {
    assumeValid: true,
  });
};
