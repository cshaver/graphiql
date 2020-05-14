"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function getASTNodeAtPosition(query, ast, point) {
    const offset = pointToOffset(query, point);
    let nodeContainingPosition;
    graphql_1.visit(ast, {
        enter(node) {
            if (node.kind !== 'Name' &&
                node.loc &&
                node.loc.start <= offset &&
                offset <= node.loc.end) {
                nodeContainingPosition = node;
            }
            else {
                return false;
            }
        },
        leave(node) {
            if (node.loc && node.loc.start <= offset && offset <= node.loc.end) {
                return false;
            }
        },
    });
    return nodeContainingPosition;
}
exports.getASTNodeAtPosition = getASTNodeAtPosition;
function pointToOffset(text, point) {
    const linesUntilPosition = text.split('\n').slice(0, point.line);
    return (point.character +
        linesUntilPosition
            .map(line => line.length + 1)
            .reduce((a, b) => a + b, 0));
}
exports.pointToOffset = pointToOffset;
//# sourceMappingURL=getASTNodeAtPosition.js.map