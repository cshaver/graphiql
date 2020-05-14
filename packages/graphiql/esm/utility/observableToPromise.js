export function observableToPromise(observable) {
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
export function isObservable(value) {
    return (typeof value === 'object' &&
        'subscribe' in value &&
        typeof value.subscribe === 'function');
}
//# sourceMappingURL=observableToPromise.js.map