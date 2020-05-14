"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const graphql_1 = require("graphql");
const graphql_language_service_parser_1 = require("graphql-language-service-parser");
const autocompleteUtils_1 = require("./autocompleteUtils");
function getAutocompleteSuggestions(schema, queryText, cursor, contextToken) {
    const token = contextToken || getTokenAtPosition(queryText, cursor);
    const state = token.state.kind === 'Invalid' ? token.state.prevState : token.state;
    if (!state) {
        return [];
    }
    const kind = state.kind;
    const step = state.step;
    const typeInfo = getTypeInfo(schema, token.state);
    if (kind === graphql_language_service_parser_1.RuleKinds.DOCUMENT) {
        return autocompleteUtils_1.hintList(token, [
            { label: 'query', kind: vscode_languageserver_types_1.CompletionItemKind.Function },
            { label: 'mutation', kind: vscode_languageserver_types_1.CompletionItemKind.Function },
            { label: 'subscription', kind: vscode_languageserver_types_1.CompletionItemKind.Function },
            { label: 'fragment', kind: vscode_languageserver_types_1.CompletionItemKind.Function },
            { label: '{', kind: vscode_languageserver_types_1.CompletionItemKind.Constructor },
        ]);
    }
    if (kind === graphql_language_service_parser_1.RuleKinds.SELECTION_SET ||
        kind === graphql_language_service_parser_1.RuleKinds.FIELD ||
        kind === graphql_language_service_parser_1.RuleKinds.ALIASED_FIELD) {
        return getSuggestionsForFieldNames(token, typeInfo, schema, kind);
    }
    if (kind === graphql_language_service_parser_1.RuleKinds.ARGUMENTS ||
        (kind === graphql_language_service_parser_1.RuleKinds.ARGUMENT && step === 0)) {
        const argDefs = typeInfo.argDefs;
        if (argDefs) {
            return autocompleteUtils_1.hintList(token, argDefs.map(argDef => ({
                label: argDef.name,
                detail: String(argDef.type),
                documentation: argDef.description,
                kind: vscode_languageserver_types_1.CompletionItemKind.Variable,
            })));
        }
    }
    if (kind === graphql_language_service_parser_1.RuleKinds.OBJECT_VALUE ||
        (kind === graphql_language_service_parser_1.RuleKinds.OBJECT_FIELD && step === 0)) {
        if (typeInfo.objectFieldDefs) {
            const objectFields = autocompleteUtils_1.objectValues(typeInfo.objectFieldDefs);
            const completionKind = kind === graphql_language_service_parser_1.RuleKinds.OBJECT_VALUE
                ? vscode_languageserver_types_1.CompletionItemKind.Value
                : vscode_languageserver_types_1.CompletionItemKind.Field;
            return autocompleteUtils_1.hintList(token, objectFields.map(field => ({
                label: field.name,
                detail: String(field.type),
                documentation: field.description,
                kind: completionKind,
            })));
        }
    }
    if (kind === graphql_language_service_parser_1.RuleKinds.ENUM_VALUE ||
        (kind === graphql_language_service_parser_1.RuleKinds.LIST_VALUE && step === 1) ||
        (kind === graphql_language_service_parser_1.RuleKinds.OBJECT_FIELD && step === 2) ||
        (kind === graphql_language_service_parser_1.RuleKinds.ARGUMENT && step === 2)) {
        return getSuggestionsForInputValues(token, typeInfo, kind);
    }
    if ((kind === graphql_language_service_parser_1.RuleKinds.TYPE_CONDITION && step === 1) ||
        (kind === graphql_language_service_parser_1.RuleKinds.NAMED_TYPE &&
            state.prevState != null &&
            state.prevState.kind === graphql_language_service_parser_1.RuleKinds.TYPE_CONDITION)) {
        return getSuggestionsForFragmentTypeConditions(token, typeInfo, schema, kind);
    }
    if (kind === graphql_language_service_parser_1.RuleKinds.FRAGMENT_SPREAD && step === 1) {
        return getSuggestionsForFragmentSpread(token, typeInfo, schema, queryText, kind);
    }
    if ((kind === graphql_language_service_parser_1.RuleKinds.VARIABLE_DEFINITION && step === 2) ||
        (kind === graphql_language_service_parser_1.RuleKinds.LIST_TYPE && step === 1) ||
        (kind === graphql_language_service_parser_1.RuleKinds.NAMED_TYPE &&
            state.prevState &&
            (state.prevState.kind === graphql_language_service_parser_1.RuleKinds.VARIABLE_DEFINITION ||
                state.prevState.kind === graphql_language_service_parser_1.RuleKinds.LIST_TYPE))) {
        return getSuggestionsForVariableDefinition(token, schema, kind);
    }
    if (kind === graphql_language_service_parser_1.RuleKinds.DIRECTIVE) {
        return getSuggestionsForDirective(token, state, schema, kind);
    }
    return [];
}
exports.getAutocompleteSuggestions = getAutocompleteSuggestions;
function getSuggestionsForFieldNames(token, typeInfo, schema, kind) {
    if (typeInfo.parentType) {
        const parentType = typeInfo.parentType;
        let fields = [];
        if ('getFields' in parentType) {
            fields = autocompleteUtils_1.objectValues(parentType.getFields());
        }
        if (graphql_1.isCompositeType(parentType)) {
            fields.push(graphql_1.TypeNameMetaFieldDef);
        }
        if (parentType === schema.getQueryType()) {
            fields.push(graphql_1.SchemaMetaFieldDef, graphql_1.TypeMetaFieldDef);
        }
        return autocompleteUtils_1.hintList(token, fields.map((field, index) => ({
            sortText: String(index) + field.name,
            label: field.name,
            detail: String(field.type),
            documentation: field.description,
            deprecated: field.isDeprecated,
            isDeprecated: field.isDeprecated,
            deprecationReason: field.deprecationReason,
            kind: vscode_languageserver_types_1.CompletionItemKind.Field,
        })));
    }
    return [];
}
function getSuggestionsForInputValues(token, typeInfo, kind) {
    const namedInputType = graphql_1.getNamedType(typeInfo.inputType);
    if (namedInputType instanceof graphql_1.GraphQLEnumType) {
        const values = namedInputType.getValues();
        return autocompleteUtils_1.hintList(token, values.map((value) => ({
            label: value.name,
            detail: String(namedInputType),
            documentation: value.description,
            deprecated: value.isDeprecated,
            isDeprecated: value.isDeprecated,
            deprecationReason: value.deprecationReason,
            kind: vscode_languageserver_types_1.CompletionItemKind.EnumMember,
        })));
    }
    else if (namedInputType === graphql_1.GraphQLBoolean) {
        return autocompleteUtils_1.hintList(token, [
            {
                label: 'true',
                detail: String(graphql_1.GraphQLBoolean),
                documentation: 'Not false.',
                kind: vscode_languageserver_types_1.CompletionItemKind.Variable,
            },
            {
                label: 'false',
                detail: String(graphql_1.GraphQLBoolean),
                documentation: 'Not true.',
                kind: vscode_languageserver_types_1.CompletionItemKind.Variable,
            },
        ]);
    }
    return [];
}
function getSuggestionsForFragmentTypeConditions(token, typeInfo, schema, kind) {
    let possibleTypes;
    if (typeInfo.parentType) {
        if (graphql_1.isAbstractType(typeInfo.parentType)) {
            const abstractType = graphql_1.assertAbstractType(typeInfo.parentType);
            const possibleObjTypes = schema.getPossibleTypes(abstractType);
            const possibleIfaceMap = Object.create(null);
            possibleObjTypes.forEach(type => {
                type.getInterfaces().forEach(iface => {
                    possibleIfaceMap[iface.name] = iface;
                });
            });
            possibleTypes = possibleObjTypes.concat(autocompleteUtils_1.objectValues(possibleIfaceMap));
        }
        else {
            possibleTypes = [typeInfo.parentType];
        }
    }
    else {
        const typeMap = schema.getTypeMap();
        possibleTypes = autocompleteUtils_1.objectValues(typeMap).filter(graphql_1.isCompositeType);
    }
    return autocompleteUtils_1.hintList(token, possibleTypes.map((type) => {
        const namedType = graphql_1.getNamedType(type);
        return {
            label: String(type),
            documentation: (namedType && namedType.description) || '',
            kind: vscode_languageserver_types_1.CompletionItemKind.Field,
        };
    }));
}
function getSuggestionsForFragmentSpread(token, typeInfo, schema, queryText, kind) {
    const typeMap = schema.getTypeMap();
    const defState = autocompleteUtils_1.getDefinitionState(token.state);
    const fragments = getFragmentDefinitions(queryText);
    const relevantFrags = fragments.filter(frag => typeMap[frag.typeCondition.name.value] &&
        !(defState &&
            defState.kind === graphql_language_service_parser_1.RuleKinds.FRAGMENT_DEFINITION &&
            defState.name === frag.name.value) &&
        graphql_1.isCompositeType(typeInfo.parentType) &&
        graphql_1.isCompositeType(typeMap[frag.typeCondition.name.value]) &&
        graphql_1.doTypesOverlap(schema, typeInfo.parentType, typeMap[frag.typeCondition.name.value]));
    return autocompleteUtils_1.hintList(token, relevantFrags.map(frag => ({
        label: frag.name.value,
        detail: String(typeMap[frag.typeCondition.name.value]),
        documentation: `fragment ${frag.name.value} on ${frag.typeCondition.name.value}`,
        kind: vscode_languageserver_types_1.CompletionItemKind.Field,
    })));
}
function getFragmentDefinitions(queryText) {
    const fragmentDefs = [];
    runOnlineParser(queryText, (_, state) => {
        if (state.kind === graphql_language_service_parser_1.RuleKinds.FRAGMENT_DEFINITION &&
            state.name &&
            state.type) {
            fragmentDefs.push({
                kind: graphql_language_service_parser_1.RuleKinds.FRAGMENT_DEFINITION,
                name: {
                    kind: 'Name',
                    value: state.name,
                },
                selectionSet: {
                    kind: graphql_language_service_parser_1.RuleKinds.SELECTION_SET,
                    selections: [],
                },
                typeCondition: {
                    kind: graphql_language_service_parser_1.RuleKinds.NAMED_TYPE,
                    name: {
                        kind: 'Name',
                        value: state.type,
                    },
                },
            });
        }
    });
    return fragmentDefs;
}
exports.getFragmentDefinitions = getFragmentDefinitions;
function getSuggestionsForVariableDefinition(token, schema, kind) {
    const inputTypeMap = schema.getTypeMap();
    const inputTypes = autocompleteUtils_1.objectValues(inputTypeMap).filter(graphql_1.isInputType);
    return autocompleteUtils_1.hintList(token, inputTypes.map((type) => ({
        label: type.name,
        documentation: type.description,
        kind: vscode_languageserver_types_1.CompletionItemKind.Variable,
    })));
}
function getSuggestionsForDirective(token, state, schema, kind) {
    if (state.prevState && state.prevState.kind) {
        const directives = schema
            .getDirectives()
            .filter(directive => canUseDirective(state.prevState, directive));
        return autocompleteUtils_1.hintList(token, directives.map(directive => ({
            label: directive.name,
            documentation: directive.description || '',
            kind: vscode_languageserver_types_1.CompletionItemKind.Function,
        })));
    }
    return [];
}
function getTokenAtPosition(queryText, cursor) {
    let styleAtCursor = null;
    let stateAtCursor = null;
    let stringAtCursor = null;
    const token = runOnlineParser(queryText, (stream, state, style, index) => {
        if (index === cursor.line) {
            if (stream.getCurrentPosition() >= cursor.character) {
                styleAtCursor = style;
                stateAtCursor = { ...state };
                stringAtCursor = stream.current();
                return 'BREAK';
            }
        }
    });
    return {
        start: token.start,
        end: token.end,
        string: stringAtCursor || token.string,
        state: stateAtCursor || token.state,
        style: styleAtCursor || token.style,
    };
}
exports.getTokenAtPosition = getTokenAtPosition;
function runOnlineParser(queryText, callback) {
    const lines = queryText.split('\n');
    const parser = graphql_language_service_parser_1.onlineParser();
    let state = parser.startState();
    let style = '';
    let stream = new graphql_language_service_parser_1.CharacterStream('');
    for (let i = 0; i < lines.length; i++) {
        stream = new graphql_language_service_parser_1.CharacterStream(lines[i]);
        while (!stream.eol()) {
            style = parser.token(stream, state);
            const code = callback(stream, state, style, i);
            if (code === 'BREAK') {
                break;
            }
        }
        callback(stream, state, style, i);
        if (!state.kind) {
            state = parser.startState();
        }
    }
    return {
        start: stream.getStartOfToken(),
        end: stream.getCurrentPosition(),
        string: stream.current(),
        state,
        style,
    };
}
exports.runOnlineParser = runOnlineParser;
function canUseDirective(state, directive) {
    if (!state || !state.kind) {
        return false;
    }
    const kind = state.kind;
    const locations = directive.locations;
    switch (kind) {
        case graphql_language_service_parser_1.RuleKinds.QUERY:
            return locations.indexOf('QUERY') !== -1;
        case graphql_language_service_parser_1.RuleKinds.MUTATION:
            return locations.indexOf('MUTATION') !== -1;
        case graphql_language_service_parser_1.RuleKinds.SUBSCRIPTION:
            return locations.indexOf('SUBSCRIPTION') !== -1;
        case graphql_language_service_parser_1.RuleKinds.FIELD:
        case graphql_language_service_parser_1.RuleKinds.ALIASED_FIELD:
            return locations.indexOf('FIELD') !== -1;
        case graphql_language_service_parser_1.RuleKinds.FRAGMENT_DEFINITION:
            return locations.indexOf('FRAGMENT_DEFINITION') !== -1;
        case graphql_language_service_parser_1.RuleKinds.FRAGMENT_SPREAD:
            return locations.indexOf('FRAGMENT_SPREAD') !== -1;
        case graphql_language_service_parser_1.RuleKinds.INLINE_FRAGMENT:
            return locations.indexOf('INLINE_FRAGMENT') !== -1;
        case graphql_language_service_parser_1.RuleKinds.SCHEMA_DEF:
            return locations.indexOf('SCHEMA') !== -1;
        case graphql_language_service_parser_1.RuleKinds.SCALAR_DEF:
            return locations.indexOf('SCALAR') !== -1;
        case graphql_language_service_parser_1.RuleKinds.OBJECT_TYPE_DEF:
            return locations.indexOf('OBJECT') !== -1;
        case graphql_language_service_parser_1.RuleKinds.FIELD_DEF:
            return locations.indexOf('FIELD_DEFINITION') !== -1;
        case graphql_language_service_parser_1.RuleKinds.INTERFACE_DEF:
            return locations.indexOf('INTERFACE') !== -1;
        case graphql_language_service_parser_1.RuleKinds.UNION_DEF:
            return locations.indexOf('UNION') !== -1;
        case graphql_language_service_parser_1.RuleKinds.ENUM_DEF:
            return locations.indexOf('ENUM') !== -1;
        case graphql_language_service_parser_1.RuleKinds.ENUM_VALUE:
            return locations.indexOf('ENUM_VALUE') !== -1;
        case graphql_language_service_parser_1.RuleKinds.INPUT_DEF:
            return locations.indexOf('INPUT_OBJECT') !== -1;
        case graphql_language_service_parser_1.RuleKinds.INPUT_VALUE_DEF:
            const prevStateKind = state.prevState && state.prevState.kind;
            switch (prevStateKind) {
                case graphql_language_service_parser_1.RuleKinds.ARGUMENTS_DEF:
                    return locations.indexOf('ARGUMENT_DEFINITION') !== -1;
                case graphql_language_service_parser_1.RuleKinds.INPUT_DEF:
                    return locations.indexOf('INPUT_FIELD_DEFINITION') !== -1;
            }
    }
    return false;
}
exports.canUseDirective = canUseDirective;
function getTypeInfo(schema, tokenState) {
    let argDef;
    let argDefs;
    let directiveDef;
    let enumValue;
    let fieldDef;
    let inputType;
    let objectFieldDefs;
    let parentType;
    let type;
    autocompleteUtils_1.forEachState(tokenState, state => {
        switch (state.kind) {
            case graphql_language_service_parser_1.RuleKinds.QUERY:
            case 'ShortQuery':
                type = schema.getQueryType();
                break;
            case graphql_language_service_parser_1.RuleKinds.MUTATION:
                type = schema.getMutationType();
                break;
            case graphql_language_service_parser_1.RuleKinds.SUBSCRIPTION:
                type = schema.getSubscriptionType();
                break;
            case graphql_language_service_parser_1.RuleKinds.INLINE_FRAGMENT:
            case graphql_language_service_parser_1.RuleKinds.FRAGMENT_DEFINITION:
                if (state.type) {
                    type = schema.getType(state.type);
                }
                break;
            case graphql_language_service_parser_1.RuleKinds.FIELD:
            case graphql_language_service_parser_1.RuleKinds.ALIASED_FIELD:
                if (!type || !state.name) {
                    fieldDef = null;
                }
                else {
                    fieldDef = parentType
                        ? autocompleteUtils_1.getFieldDef(schema, parentType, state.name)
                        : null;
                    type = fieldDef ? fieldDef.type : null;
                }
                break;
            case graphql_language_service_parser_1.RuleKinds.SELECTION_SET:
                parentType = graphql_1.getNamedType(type);
                break;
            case graphql_language_service_parser_1.RuleKinds.DIRECTIVE:
                directiveDef = state.name ? schema.getDirective(state.name) : null;
                break;
            case graphql_language_service_parser_1.RuleKinds.ARGUMENTS:
                if (!state.prevState) {
                    argDefs = null;
                }
                else {
                    switch (state.prevState.kind) {
                        case graphql_language_service_parser_1.RuleKinds.FIELD:
                            argDefs = fieldDef && fieldDef.args;
                            break;
                        case graphql_language_service_parser_1.RuleKinds.DIRECTIVE:
                            argDefs = directiveDef && directiveDef.args;
                            break;
                        case graphql_language_service_parser_1.RuleKinds.ALIASED_FIELD:
                            const name = state.prevState && state.prevState.name;
                            if (!name) {
                                argDefs = null;
                                break;
                            }
                            const field = parentType
                                ? autocompleteUtils_1.getFieldDef(schema, parentType, name)
                                : null;
                            if (!field) {
                                argDefs = null;
                                break;
                            }
                            argDefs = field.args;
                            break;
                        default:
                            argDefs = null;
                            break;
                    }
                }
                break;
            case graphql_language_service_parser_1.RuleKinds.ARGUMENT:
                if (argDefs) {
                    for (let i = 0; i < argDefs.length; i++) {
                        if (argDefs[i].name === state.name) {
                            argDef = argDefs[i];
                            break;
                        }
                    }
                }
                inputType = argDef && argDef.type;
                break;
            case graphql_language_service_parser_1.RuleKinds.ENUM_VALUE:
                const enumType = graphql_1.getNamedType(inputType);
                enumValue =
                    enumType instanceof graphql_1.GraphQLEnumType
                        ? find(enumType.getValues(), (val) => val.value === state.name)
                        : null;
                break;
            case graphql_language_service_parser_1.RuleKinds.LIST_VALUE:
                const nullableType = graphql_1.getNullableType(inputType);
                inputType =
                    nullableType instanceof graphql_1.GraphQLList ? nullableType.ofType : null;
                break;
            case graphql_language_service_parser_1.RuleKinds.OBJECT_VALUE:
                const objectType = graphql_1.getNamedType(inputType);
                objectFieldDefs =
                    objectType instanceof graphql_1.GraphQLInputObjectType
                        ? objectType.getFields()
                        : null;
                break;
            case graphql_language_service_parser_1.RuleKinds.OBJECT_FIELD:
                const objectField = state.name && objectFieldDefs ? objectFieldDefs[state.name] : null;
                inputType = objectField && objectField.type;
                break;
            case graphql_language_service_parser_1.RuleKinds.NAMED_TYPE:
                if (state.name) {
                    type = schema.getType(state.name);
                }
                break;
        }
    });
    return {
        argDef,
        argDefs,
        directiveDef,
        enumValue,
        fieldDef,
        inputType,
        objectFieldDefs,
        parentType,
        type,
    };
}
exports.getTypeInfo = getTypeInfo;
function find(array, predicate) {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return array[i];
        }
    }
    return null;
}
//# sourceMappingURL=getAutocompleteSuggestions.js.map