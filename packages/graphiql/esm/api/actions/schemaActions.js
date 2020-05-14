export var SchemaActionTypes;
(function (SchemaActionTypes) {
    SchemaActionTypes["SchemaChanged"] = "SchemaChanged";
    SchemaActionTypes["SchemaRequested"] = "SchemaRequested";
    SchemaActionTypes["SchemaSucceeded"] = "SchemaSucceeded";
    SchemaActionTypes["SchemaErrored"] = "SchemaErrored";
    SchemaActionTypes["SchemaReset"] = "SchemaReset";
})(SchemaActionTypes || (SchemaActionTypes = {}));
export var schemaChangedAction = function (config) {
    return ({
        type: SchemaActionTypes.SchemaChanged,
        payload: config,
    });
};
export var schemaRequestedAction = function () {
    return ({
        type: SchemaActionTypes.SchemaRequested,
    });
};
export var schemaSucceededAction = function (schema) {
    return ({
        type: SchemaActionTypes.SchemaSucceeded,
        payload: schema,
    });
};
export var schemaErroredAction = function (error) {
    return ({
        type: SchemaActionTypes.SchemaErrored,
        payload: error,
    });
};
export var schemaResetAction = function () {
    return ({
        type: SchemaActionTypes.SchemaReset,
    });
};
//# sourceMappingURL=schemaActions.js.map