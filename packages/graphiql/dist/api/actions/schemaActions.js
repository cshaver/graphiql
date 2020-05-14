"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchemaActionTypes;
(function (SchemaActionTypes) {
    SchemaActionTypes["SchemaChanged"] = "SchemaChanged";
    SchemaActionTypes["SchemaRequested"] = "SchemaRequested";
    SchemaActionTypes["SchemaSucceeded"] = "SchemaSucceeded";
    SchemaActionTypes["SchemaErrored"] = "SchemaErrored";
    SchemaActionTypes["SchemaReset"] = "SchemaReset";
})(SchemaActionTypes = exports.SchemaActionTypes || (exports.SchemaActionTypes = {}));
exports.schemaChangedAction = function (config) {
    return ({
        type: SchemaActionTypes.SchemaChanged,
        payload: config,
    });
};
exports.schemaRequestedAction = function () {
    return ({
        type: SchemaActionTypes.SchemaRequested,
    });
};
exports.schemaSucceededAction = function (schema) {
    return ({
        type: SchemaActionTypes.SchemaSucceeded,
        payload: schema,
    });
};
exports.schemaErroredAction = function (error) {
    return ({
        type: SchemaActionTypes.SchemaErrored,
        payload: error,
    });
};
exports.schemaResetAction = function () {
    return ({
        type: SchemaActionTypes.SchemaReset,
    });
};
//# sourceMappingURL=schemaActions.js.map