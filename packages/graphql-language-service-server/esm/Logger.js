import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';
import { DIAGNOSTIC_SEVERITY, SEVERITY, } from 'graphql-language-service-interface';
export class Logger {
    constructor() {
        const dir = join(os.tmpdir(), 'graphql-language-service-logs');
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }
        catch (_) {
        }
        this._logFilePath = join(dir, `graphql-language-service-log-${os.userInfo().username}-${getDateString()}.log`);
        this._stream = null;
    }
    error(message) {
        this._log(message, SEVERITY.Error);
    }
    warn(message) {
        this._log(message, SEVERITY.Warning);
    }
    info(message) {
        this._log(message, SEVERITY.Information);
    }
    log(message) {
        this._log(message, SEVERITY.Hint);
    }
    _log(message, severityKey) {
        const timestamp = new Date().toLocaleString(undefined);
        const severity = DIAGNOSTIC_SEVERITY[severityKey];
        const pid = process.pid;
        const logMessage = `${timestamp} [${severity}] (pid: ${pid}) graphql-language-service-usage-logs: ${message}\n\n`;
        fs.appendFile(this._logFilePath, logMessage, _error => { });
        process.stderr.write(logMessage, _err => {
        });
    }
}
function getDateString() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
//# sourceMappingURL=Logger.js.map