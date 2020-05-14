import * as languageFeatures from './languageFeatures';
import type { DocumentNode } from 'graphql';
import { SchemaResponse } from 'graphql-languageservice';
export declare class MonacoGraphQLApi {
    private worker;
    constructor({ accessor }: {
        accessor: languageFeatures.WorkerAccessor;
    });
    getSchema(): Promise<SchemaResponse>;
    parse(graphqlString: string): Promise<DocumentNode>;
}
//# sourceMappingURL=api.d.ts.map