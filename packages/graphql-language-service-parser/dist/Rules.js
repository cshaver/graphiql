"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RuleHelpers_1 = require("./RuleHelpers");
exports.isIgnored = (ch) => ch === ' ' ||
    ch === '\t' ||
    ch === ',' ||
    ch === '\n' ||
    ch === '\r' ||
    ch === '\uFEFF' ||
    ch === '\u00A0';
exports.LexRules = {
    Name: /^[_A-Za-z][_0-9A-Za-z]*/,
    Punctuation: /^(?:!|\$|\(|\)|\.\.\.|:|=|@|\[|]|\{|\||\})/,
    Number: /^-?(?:0|(?:[1-9][0-9]*))(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?/,
    String: /^(?:"""(?:\\"""|[^"]|"[^"]|""[^"])*(?:""")?|"(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*"?)/,
    Comment: /^#.*/,
};
exports.ParseRules = {
    Document: [RuleHelpers_1.list('Definition')],
    Definition(token) {
        switch (token.value) {
            case '{':
                return 'ShortQuery';
            case 'query':
                return 'Query';
            case 'mutation':
                return 'Mutation';
            case 'subscription':
                return 'Subscription';
            case 'fragment':
                return 'FragmentDefinition';
            case 'schema':
                return 'SchemaDef';
            case 'scalar':
                return 'ScalarDef';
            case 'type':
                return 'ObjectTypeDef';
            case 'interface':
                return 'InterfaceDef';
            case 'union':
                return 'UnionDef';
            case 'enum':
                return 'EnumDef';
            case 'input':
                return 'InputDef';
            case 'extend':
                return 'ExtendDef';
            case 'directive':
                return 'DirectiveDef';
        }
    },
    ShortQuery: ['SelectionSet'],
    Query: [
        word('query'),
        RuleHelpers_1.opt(name('def')),
        RuleHelpers_1.opt('VariableDefinitions'),
        RuleHelpers_1.list('Directive'),
        'SelectionSet',
    ],
    Mutation: [
        word('mutation'),
        RuleHelpers_1.opt(name('def')),
        RuleHelpers_1.opt('VariableDefinitions'),
        RuleHelpers_1.list('Directive'),
        'SelectionSet',
    ],
    Subscription: [
        word('subscription'),
        RuleHelpers_1.opt(name('def')),
        RuleHelpers_1.opt('VariableDefinitions'),
        RuleHelpers_1.list('Directive'),
        'SelectionSet',
    ],
    VariableDefinitions: [RuleHelpers_1.p('('), RuleHelpers_1.list('VariableDefinition'), RuleHelpers_1.p(')')],
    VariableDefinition: ['Variable', RuleHelpers_1.p(':'), 'Type', RuleHelpers_1.opt('DefaultValue')],
    Variable: [RuleHelpers_1.p('$', 'variable'), name('variable')],
    DefaultValue: [RuleHelpers_1.p('='), 'Value'],
    SelectionSet: [RuleHelpers_1.p('{'), RuleHelpers_1.list('Selection'), RuleHelpers_1.p('}')],
    Selection(token, stream) {
        return token.value === '...'
            ? stream.match(/[\s\u00a0,]*(on\b|@|{)/, false)
                ? 'InlineFragment'
                : 'FragmentSpread'
            : stream.match(/[\s\u00a0,]*:/, false)
                ? 'AliasedField'
                : 'Field';
    },
    AliasedField: [
        name('property'),
        RuleHelpers_1.p(':'),
        name('qualifier'),
        RuleHelpers_1.opt('Arguments'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.opt('SelectionSet'),
    ],
    Field: [
        name('property'),
        RuleHelpers_1.opt('Arguments'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.opt('SelectionSet'),
    ],
    Arguments: [RuleHelpers_1.p('('), RuleHelpers_1.list('Argument'), RuleHelpers_1.p(')')],
    Argument: [name('attribute'), RuleHelpers_1.p(':'), 'Value'],
    FragmentSpread: [RuleHelpers_1.p('...'), name('def'), RuleHelpers_1.list('Directive')],
    InlineFragment: [
        RuleHelpers_1.p('...'),
        RuleHelpers_1.opt('TypeCondition'),
        RuleHelpers_1.list('Directive'),
        'SelectionSet',
    ],
    FragmentDefinition: [
        word('fragment'),
        RuleHelpers_1.opt(RuleHelpers_1.butNot(name('def'), [word('on')])),
        'TypeCondition',
        RuleHelpers_1.list('Directive'),
        'SelectionSet',
    ],
    TypeCondition: [word('on'), 'NamedType'],
    Value(token) {
        switch (token.kind) {
            case 'Number':
                return 'NumberValue';
            case 'String':
                return 'StringValue';
            case 'Punctuation':
                switch (token.value) {
                    case '[':
                        return 'ListValue';
                    case '{':
                        return 'ObjectValue';
                    case '$':
                        return 'Variable';
                }
                return null;
            case 'Name':
                switch (token.value) {
                    case 'true':
                    case 'false':
                        return 'BooleanValue';
                }
                if (token.value === 'null') {
                    return 'NullValue';
                }
                return 'EnumValue';
        }
    },
    NumberValue: [RuleHelpers_1.t('Number', 'number')],
    StringValue: [RuleHelpers_1.t('String', 'string')],
    BooleanValue: [RuleHelpers_1.t('Name', 'builtin')],
    NullValue: [RuleHelpers_1.t('Name', 'keyword')],
    EnumValue: [name('string-2')],
    ListValue: [RuleHelpers_1.p('['), RuleHelpers_1.list('Value'), RuleHelpers_1.p(']')],
    ObjectValue: [RuleHelpers_1.p('{'), RuleHelpers_1.list('ObjectField'), RuleHelpers_1.p('}')],
    ObjectField: [name('attribute'), RuleHelpers_1.p(':'), 'Value'],
    Type(token) {
        return token.value === '[' ? 'ListType' : 'NonNullType';
    },
    ListType: [RuleHelpers_1.p('['), 'Type', RuleHelpers_1.p(']'), RuleHelpers_1.opt(RuleHelpers_1.p('!'))],
    NonNullType: ['NamedType', RuleHelpers_1.opt(RuleHelpers_1.p('!'))],
    NamedType: [type('atom')],
    Directive: [RuleHelpers_1.p('@', 'meta'), name('meta'), RuleHelpers_1.opt('Arguments')],
    SchemaDef: [
        word('schema'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.p('{'),
        RuleHelpers_1.list('OperationTypeDef'),
        RuleHelpers_1.p('}'),
    ],
    OperationTypeDef: [name('keyword'), RuleHelpers_1.p(':'), name('atom')],
    ScalarDef: [word('scalar'), name('atom'), RuleHelpers_1.list('Directive')],
    ObjectTypeDef: [
        word('type'),
        name('atom'),
        RuleHelpers_1.opt('Implements'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.p('{'),
        RuleHelpers_1.list('FieldDef'),
        RuleHelpers_1.p('}'),
    ],
    Implements: [word('implements'), RuleHelpers_1.list('NamedType')],
    FieldDef: [
        name('property'),
        RuleHelpers_1.opt('ArgumentsDef'),
        RuleHelpers_1.p(':'),
        'Type',
        RuleHelpers_1.list('Directive'),
    ],
    ArgumentsDef: [RuleHelpers_1.p('('), RuleHelpers_1.list('InputValueDef'), RuleHelpers_1.p(')')],
    InputValueDef: [
        name('attribute'),
        RuleHelpers_1.p(':'),
        'Type',
        RuleHelpers_1.opt('DefaultValue'),
        RuleHelpers_1.list('Directive'),
    ],
    InterfaceDef: [
        word('interface'),
        name('atom'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.p('{'),
        RuleHelpers_1.list('FieldDef'),
        RuleHelpers_1.p('}'),
    ],
    UnionDef: [
        word('union'),
        name('atom'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.p('='),
        RuleHelpers_1.list('UnionMember', RuleHelpers_1.p('|')),
    ],
    UnionMember: ['NamedType'],
    EnumDef: [
        word('enum'),
        name('atom'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.p('{'),
        RuleHelpers_1.list('EnumValueDef'),
        RuleHelpers_1.p('}'),
    ],
    EnumValueDef: [name('string-2'), RuleHelpers_1.list('Directive')],
    InputDef: [
        word('input'),
        name('atom'),
        RuleHelpers_1.list('Directive'),
        RuleHelpers_1.p('{'),
        RuleHelpers_1.list('InputValueDef'),
        RuleHelpers_1.p('}'),
    ],
    ExtendDef: [word('extend'), 'ObjectTypeDef'],
    DirectiveDef: [
        word('directive'),
        RuleHelpers_1.p('@', 'meta'),
        name('meta'),
        RuleHelpers_1.opt('ArgumentsDef'),
        word('on'),
        RuleHelpers_1.list('DirectiveLocation', RuleHelpers_1.p('|')),
    ],
    DirectiveLocation: [name('string-2')],
};
function word(value) {
    return {
        style: 'keyword',
        match: (token) => token.kind === 'Name' && token.value === value,
    };
}
function name(style) {
    return {
        style,
        match: (token) => token.kind === 'Name',
        update(state, token) {
            state.name = token.value;
        },
    };
}
function type(style) {
    return {
        style,
        match: (token) => token.kind === 'Name',
        update(state, token) {
            if (state.prevState && state.prevState.prevState) {
                state.name = token.value;
                state.prevState.prevState.type = token.value;
            }
        },
    };
}
//# sourceMappingURL=Rules.js.map