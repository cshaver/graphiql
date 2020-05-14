"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function opt(ofRule) {
    return { ofRule };
}
exports.opt = opt;
function list(ofRule, separator) {
    return { ofRule, isList: true, separator };
}
exports.list = list;
function butNot(rule, exclusions) {
    const ruleMatch = rule.match;
    rule.match = token => {
        let check = false;
        if (ruleMatch) {
            check = ruleMatch(token);
        }
        return (check &&
            exclusions.every(exclusion => exclusion.match && !exclusion.match(token)));
    };
    return rule;
}
exports.butNot = butNot;
function t(kind, style) {
    return { style, match: (token) => token.kind === kind };
}
exports.t = t;
function p(value, style) {
    return {
        style: style || 'punctuation',
        match: (token) => token.kind === 'Punctuation' && token.value === value,
    };
}
exports.p = p;
//# sourceMappingURL=RuleHelpers.js.map