/// <reference types="node" />
import { Logger as VSCodeLogger } from 'vscode-jsonrpc';
import * as fs from 'fs';
import { SeverityEnum } from 'graphql-language-service-interface';
export declare class Logger implements VSCodeLogger {
    _logFilePath: string;
    _stream: fs.WriteStream | null;
    constructor();
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
    log(message: string): void;
    _log(message: string, severityKey: SeverityEnum): void;
}
//# sourceMappingURL=Logger.d.ts.map