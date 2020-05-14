"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
exports.AdditionalRuleKinds = {
    ALIASED_FIELD: 'AliasedField',
    ARGUMENTS: 'Arguments',
    SHORT_QUERY: 'ShortQuery',
    QUERY: 'Query',
    MUTATION: 'Mutation',
    SUBSCRIPTION: 'Subscription',
    TYPE_CONDITION: 'TypeCondition',
    INVALID: 'Invalid',
    COMMENT: 'Comment',
    SCHEMA_DEF: 'SchemaDef',
    SCALAR_DEF: 'ScalarDef',
    OBJECT_TYPE_DEF: 'ObjectTypeDef',
    OBJECT_VALUE: 'ObjectValue',
    LIST_VALUE: 'ListValue',
    INTERFACE_DEF: 'InterfaceDef',
    UNION_DEF: 'UnionDef',
    ENUM_DEF: 'EnumDef',
    ENUM_VALUE: 'EnumValue',
    FIELD_DEF: 'FieldDef',
    INPUT_DEF: 'InputDef',
    INPUT_VALUE_DEF: 'InputValueDef',
    ARGUMENTS_DEF: 'ArgumentsDef',
    EXTEND_DEF: 'ExtendDef',
    DIRECTIVE_DEF: 'DirectiveDef',
};
exports.RuleKinds = {
    ...graphql_1.Kind,
    ...exports.AdditionalRuleKinds,
};
//# sourceMappingURL=types.js.map