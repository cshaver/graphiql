"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function observableToPromise(observable) {
    if (!isObservable(observable)) {
        return observable;
    }
    return new Promise(function (resolve, reject) {
        var subscription = observable.subscribe(function (v) {
            resolve(v);
            subscription.unsubscribe();
        }, reject, function () {
            reject(new Error('no value resolved'));
        });
    });
}
exports.observableToPromise = observableToPromise;
function isObservable(value) {
    return (typeof value === 'object' &&
        'subscribe' in value &&
        typeof value.subscribe === 'function');
}
exports.isObservable = isObservable;
//# sourceMappingURL=observableToPromise.js.map