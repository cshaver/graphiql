import { Observable } from '../types';
export declare function observableToPromise<T>(observable: Observable<T> | Promise<T>): Promise<T>;
export declare function isObservable<T>(value: any): value is Observable<T>;
//# sourceMappingURL=observableToPromise.d.ts.map