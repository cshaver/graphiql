import { SchemaConfig, Fetcher } from '../types';
import { GraphQLParams } from './types';
export declare function getDefaultFetcher(schemaConfig: SchemaConfig): (graphqlParams: GraphQLParams) => Promise<any>;
export declare function getFetcher({ fetcher, uri, }: {
    fetcher?: Fetcher;
    uri?: string;
}): Fetcher | ((graphqlParams: GraphQLParams) => Promise<any>);
//# sourceMappingURL=common.d.ts.map