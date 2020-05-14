"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var GraphiQLSessionProvider_1 = require("../api/providers/GraphiQLSessionProvider");
var useQueryFacts_1 = __importDefault(require("../api/hooks/useQueryFacts"));
function ExecuteButton(props) {
    var _a;
    var _b = react_1.useState(false), optionsOpen = _b[0], setOptionsOpen = _b[1];
    var queryFacts = useQueryFacts_1.default();
    var _c = react_1.useState(null), highlight = _c[0], setHighlight = _c[1];
    var session = GraphiQLSessionProvider_1.useSessionContext();
    var operations = (_a = queryFacts === null || queryFacts === void 0 ? void 0 : queryFacts.operations) !== null && _a !== void 0 ? _a : [];
    var hasOptions = operations && operations.length > 1;
    var options = null;
    if (hasOptions && optionsOpen) {
        options = (react_1.default.createElement("ul", { className: "execute-options" }, operations.map(function (operation, i) {
            var opName = operation.name
                ? operation.name.value
                : "<Unnamed " + operation.operation + ">";
            return (react_1.default.createElement("li", { key: opName + "-" + i, className: operation === highlight ? 'selected' : undefined, onMouseOver: function () { return setHighlight(operation); }, onMouseOut: function () { return setHighlight(null); }, onMouseUp: function () {
                    var _a;
                    setOptionsOpen(false);
                    session.executeOperation((_a = operation === null || operation === void 0 ? void 0 : operation.name) === null || _a === void 0 ? void 0 : _a.value);
                } }, opName));
        })));
    }
    var onClick = function () {
        if (props.isRunning || !hasOptions) {
            if (props.isRunning) {
                props.onStop();
            }
            else {
                session.executeOperation();
            }
        }
    };
    var onMouseDown = function (downEvent) {
        if (!props.isRunning && hasOptions && !optionsOpen) {
            var initialPress_1 = true;
            var downTarget_1 = downEvent.currentTarget;
            setHighlight(null);
            setOptionsOpen(true);
            var onMouseUp_1 = function (upEvent) {
                var _a;
                if (initialPress_1 && upEvent.target === downTarget_1) {
                    initialPress_1 = false;
                }
                else {
                    document.removeEventListener('mouseup', onMouseUp_1);
                    onMouseUp_1 = null;
                    var isOptionsMenuClicked = upEvent.currentTarget && ((_a = downTarget_1.parentNode) === null || _a === void 0 ? void 0 : _a.compareDocumentPosition(upEvent.currentTarget)) &&
                        Node.DOCUMENT_POSITION_CONTAINED_BY;
                    if (!isOptionsMenuClicked) {
                        setOptionsOpen(false);
                    }
                }
            };
            document.addEventListener('mouseup', onMouseUp_1);
        }
    };
    var pathJSX = props.isRunning ? (react_1.default.createElement("path", { d: "M 10 10 L 23 10 L 23 23 L 10 23 z" })) : (react_1.default.createElement("path", { d: "M 11 9 L 24 16 L 11 23 z" }));
    return (react_1.default.createElement("div", { className: "execute-button-wrap" },
        react_1.default.createElement("button", { type: "button", className: "execute-button", onMouseDown: onMouseDown, onClick: onClick, title: "Execute Query (Ctrl-Enter)" },
            react_1.default.createElement("svg", { width: "34", height: "34" }, pathJSX)),
        options));
}
exports.ExecuteButton = ExecuteButton;
//# sourceMappingURL=ExecuteButton.js.map