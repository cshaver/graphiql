"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path_1 = require("path");
const graphql_language_service_interface_1 = require("graphql-language-service-interface");
class Logger {
    constructor() {
        const dir = path_1.join(os.tmpdir(), 'graphql-language-service-logs');
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
        catch (_) {
        }
        this._logFilePath = path_1.join(dir, `graphql-language-service-log-${os.userInfo().username}-${getDateString()}.log`);
        this._stream = null;
    }
    error(message) {
        this._log(message, graphql_language_service_interface_1.SEVERITY.Error);
    }
    warn(message) {
        this._log(message, graphql_language_service_interface_1.SEVERITY.Warning);
    }
    info(message) {
        this._log(message, graphql_language_service_interface_1.SEVERITY.Information);
    }
    log(message) {
        this._log(message, graphql_language_service_interface_1.SEVERITY.Hint);
    }
    _log(message, severityKey) {
        const timestamp = new Date().toLocaleString(undefined);
        const severity = graphql_language_service_interface_1.DIAGNOSTIC_SEVERITY[severityKey];
        const pid = process.pid;
        const logMessage = `${timestamp} [${severity}] (pid: ${pid}) graphql-language-service-usage-logs: ${message}\n\n`;
        fs.appendFile(this._logFilePath, logMessage, _error => { });
        process.stderr.write(logMessage, _err => {
        });
    }
}
exports.Logger = Logger;
function getDateString() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
//# sourceMappingURL=Logger.js.map