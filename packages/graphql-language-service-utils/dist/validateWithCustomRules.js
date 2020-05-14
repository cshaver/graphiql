"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const ExecutableDefinitions_1 = require("graphql/validation/rules/ExecutableDefinitions");
function validateWithCustomRules(schema, ast, customRules, isRelayCompatMode) {
    const rules = graphql_1.specifiedRules.filter(rule => {
        if (rule === graphql_1.NoUnusedFragmentsRule || rule === ExecutableDefinitions_1.ExecutableDefinitions) {
            return false;
        }
        if (isRelayCompatMode && rule === graphql_1.KnownFragmentNamesRule) {
            return false;
        }
        return true;
    });
    if (customRules) {
        Array.prototype.push.apply(rules, customRules);
    }
    const errors = graphql_1.validate(schema, ast, rules);
    return errors.filter(error => {
        if (error.message.indexOf('Unknown directive') !== -1 && error.nodes) {
            const node = error.nodes[0];
            if (node && node.kind === graphql_1.Kind.DIRECTIVE) {
                const name = node.name.value;
                if (name === 'arguments' || name === 'argumentDefinitions') {
                    return false;
                }
            }
        }
        return true;
    });
}
exports.validateWithCustomRules = validateWithCustomRules;
//# sourceMappingURL=validateWithCustomRules.js.map