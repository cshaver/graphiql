"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const MessageProcessor_1 = require("./MessageProcessor");
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const vscode_languageserver_1 = require("vscode-languageserver");
const Logger_1 = require("./Logger");
async function startServer(options) {
    const logger = new Logger_1.Logger();
    if (options && options.method) {
        let reader;
        let writer;
        switch (options.method) {
            case 'socket':
                if (!options.port) {
                    process.stderr.write('--port is required to establish socket connection.');
                    process.exit(1);
                }
                const port = options.port;
                const socket = net
                    .createServer(client => {
                    client.setEncoding('utf8');
                    reader = new vscode_jsonrpc_1.SocketMessageReader(client);
                    writer = new vscode_jsonrpc_1.SocketMessageWriter(client);
                    client.on('end', () => {
                        socket.close();
                        process.exit(0);
                    });
                    const serverWithHandlers = initializeHandlers({
                        reader,
                        writer,
                        logger,
                        options,
                    });
                    serverWithHandlers.listen();
                })
                    .listen(port);
                return;
            case 'stream':
                reader = new vscode_jsonrpc_1.StreamMessageReader(process.stdin);
                writer = new vscode_jsonrpc_1.StreamMessageWriter(process.stdout);
                break;
            case 'node':
            default:
                reader = new vscode_jsonrpc_1.IPCMessageReader(process);
                writer = new vscode_jsonrpc_1.IPCMessageWriter(process);
                break;
        }
        try {
            const serverWithHandlers = initializeHandlers({
                reader,
                writer,
                logger,
                options,
            });
            return serverWithHandlers.listen();
        }
        catch (err) {
            logger.error('There was a Graphql LSP handler exception:');
            logger.error(err);
        }
    }
}
exports.default = startServer;
function initializeHandlers({ reader, writer, logger, options = {}, }) {
    try {
        const connection = vscode_jsonrpc_1.createMessageConnection(reader, writer, logger);
        addHandlers(connection, logger, options.configDir, (options === null || options === void 0 ? void 0 : options.extensions) || [], options.config, options.parser, options.fileExtensions);
        return connection;
    }
    catch (err) {
        logger.error('There was an error initializing the server connection');
        logger.error(err);
        process.exit(1);
    }
}
function addHandlers(connection, logger, configDir, extensions, config, parser, fileExtensions) {
    const messageProcessor = new MessageProcessor_1.MessageProcessor(logger, extensions, config, parser, fileExtensions);
    connection.onNotification(vscode_languageserver_1.DidOpenTextDocumentNotification.type, async (params) => {
        const diagnostics = await messageProcessor.handleDidOpenOrSaveNotification(params);
        if (diagnostics) {
            connection.sendNotification(vscode_languageserver_1.PublishDiagnosticsNotification.type, diagnostics);
        }
    });
    connection.onNotification(vscode_languageserver_1.DidSaveTextDocumentNotification.type, async (params) => {
        const diagnostics = await messageProcessor.handleDidOpenOrSaveNotification(params);
        if (diagnostics) {
            connection.sendNotification(vscode_languageserver_1.PublishDiagnosticsNotification.type, diagnostics);
        }
    });
    connection.onNotification(vscode_languageserver_1.DidChangeTextDocumentNotification.type, async (params) => {
        const diagnostics = await messageProcessor.handleDidChangeNotification(params);
        if (diagnostics) {
            connection.sendNotification(vscode_languageserver_1.PublishDiagnosticsNotification.type, diagnostics);
        }
    });
    connection.onNotification(vscode_languageserver_1.DidCloseTextDocumentNotification.type, params => messageProcessor.handleDidCloseNotification(params));
    connection.onRequest(vscode_languageserver_1.ShutdownRequest.type, () => messageProcessor.handleShutdownRequest());
    connection.onNotification(vscode_languageserver_1.ExitNotification.type, () => messageProcessor.handleExitNotification());
    connection.onNotification('$/cancelRequest', () => ({}));
    connection.onRequest(vscode_languageserver_1.InitializeRequest.type, (params, token) => messageProcessor.handleInitializeRequest(params, token, configDir));
    connection.onRequest(vscode_languageserver_1.CompletionRequest.type, params => messageProcessor.handleCompletionRequest(params));
    connection.onRequest(vscode_languageserver_1.CompletionResolveRequest.type, item => item);
    connection.onRequest(vscode_languageserver_1.DefinitionRequest.type, params => messageProcessor.handleDefinitionRequest(params));
    connection.onRequest(vscode_languageserver_1.HoverRequest.type, params => messageProcessor.handleHoverRequest(params));
    connection.onNotification(vscode_languageserver_1.DidChangeWatchedFilesNotification.type, params => messageProcessor.handleWatchedFilesChangedNotification(params));
    connection.onRequest(vscode_languageserver_1.DocumentSymbolRequest.type, params => messageProcessor.handleDocumentSymbolRequest(params));
}
//# sourceMappingURL=startServer.js.map