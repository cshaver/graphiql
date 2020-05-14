"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const url_1 = require("url");
const graphql_language_service_types_1 = require("graphql-language-service-types");
const graphql_language_service_interface_1 = require("graphql-language-service-interface");
const graphql_language_service_utils_1 = require("graphql-language-service-utils");
const GraphQLCache_1 = require("./GraphQLCache");
const parseDocument_1 = require("./parseDocument");
class MessageProcessor {
    constructor(logger, extensions, config, parser, fileExtensions) {
        this._textDocumentCache = new Map();
        this._isInitialized = false;
        this._willShutdown = false;
        this._logger = logger;
        this._extensions = extensions;
        this._fileExtensions = fileExtensions;
        this._graphQLConfig = config;
        this._parser = parser !== null && parser !== void 0 ? parser : parseDocument_1.parseDocument;
    }
    async handleInitializeRequest(params, _token, configDir) {
        if (!params) {
            throw new Error('`params` argument is required to initialize.');
        }
        const serverCapabilities = {
            capabilities: {
                workspaceSymbolProvider: true,
                documentSymbolProvider: true,
                completionProvider: {
                    resolveProvider: true,
                    triggerCharacters: ['@'],
                },
                definitionProvider: true,
                textDocumentSync: 1,
                hoverProvider: true,
            },
        };
        const rootPath = configDir ? configDir.trim() : params.rootPath;
        if (!rootPath) {
            throw new Error('`--configDir` option or `rootPath` argument is required.');
        }
        this._graphQLCache = await GraphQLCache_1.getGraphQLCache(rootPath, this._parser, this._extensions, this._graphQLConfig);
        this._languageService = new graphql_language_service_interface_1.GraphQLLanguageService(this._graphQLCache);
        if (!serverCapabilities) {
            throw new Error('GraphQL Language Server is not initialized.');
        }
        this._isInitialized = true;
        this._logger.log(JSON.stringify({
            type: 'usage',
            messageType: 'initialize',
        }));
        return serverCapabilities;
    }
    async handleDidOpenOrSaveNotification(params) {
        if (!this._isInitialized || !this._graphQLCache) {
            return null;
        }
        if (!params || !params.textDocument) {
            throw new Error('`textDocument` argument is required.');
        }
        const { textDocument } = params;
        const { uri } = textDocument;
        const diagnostics = [];
        let contents = [];
        if ('text' in textDocument && textDocument.text) {
            contents = this._parser(textDocument.text, uri, this._fileExtensions);
            this._invalidateCache(textDocument, uri, contents);
        }
        else {
            const cachedDocument = this._getCachedDocument(textDocument.uri);
            if (cachedDocument) {
                contents = cachedDocument.contents;
            }
        }
        await Promise.all(contents.map(async ({ query, range }) => {
            const results = await this._languageService.getDiagnostics(query, uri, this._isRelayCompatMode(query) ? false : true);
            if (results && results.length > 0) {
                diagnostics.push(...processDiagnosticsMessage(results, query, range));
            }
        }));
        const project = this._graphQLCache
            .getGraphQLConfig()
            .getProjectForFile(uri);
        this._logger.log(JSON.stringify({
            type: 'usage',
            messageType: 'textDocument/didOpen',
            projectName: project && project.name,
            fileName: uri,
        }));
        return { uri, diagnostics };
    }
    async handleDidChangeNotification(params) {
        if (!this._isInitialized || !this._graphQLCache) {
            return null;
        }
        if (!params ||
            !params.textDocument ||
            !params.contentChanges ||
            !params.textDocument.uri) {
            throw new Error('`textDocument`, `textDocument.uri`, and `contentChanges` arguments are required.');
        }
        const textDocument = params.textDocument;
        const contentChanges = params.contentChanges;
        const contentChange = contentChanges[contentChanges.length - 1];
        const uri = textDocument.uri;
        const contents = this._parser(contentChange.text, uri, this._fileExtensions);
        this._invalidateCache(textDocument, uri, contents);
        const cachedDocument = this._getCachedDocument(uri);
        if (!cachedDocument) {
            return null;
        }
        this._updateFragmentDefinition(uri, contents);
        this._updateObjectTypeDefinition(uri, contents);
        const diagnostics = [];
        await Promise.all(contents.map(async ({ query, range }) => {
            const results = await this._languageService.getDiagnostics(query, uri);
            if (results && results.length > 0) {
                diagnostics.push(...processDiagnosticsMessage(results, query, range));
            }
        }));
        const project = this._graphQLCache
            .getGraphQLConfig()
            .getProjectForFile(uri);
        this._logger.log(JSON.stringify({
            type: 'usage',
            messageType: 'textDocument/didChange',
            projectName: project && project.name,
            fileName: uri,
        }));
        return { uri, diagnostics };
    }
    handleDidCloseNotification(params) {
        if (!this._isInitialized || !this._graphQLCache) {
            return;
        }
        if (!params || !params.textDocument) {
            throw new Error('`textDocument` is required.');
        }
        const textDocument = params.textDocument;
        const uri = textDocument.uri;
        if (this._textDocumentCache.has(uri)) {
            this._textDocumentCache.delete(uri);
        }
        const project = this._graphQLCache
            .getGraphQLConfig()
            .getProjectForFile(uri);
        this._logger.log(JSON.stringify({
            type: 'usage',
            messageType: 'textDocument/didClose',
            projectName: project && project.name,
            fileName: uri,
        }));
    }
    handleShutdownRequest() {
        this._willShutdown = true;
        return;
    }
    handleExitNotification() {
        process.exit(this._willShutdown ? 0 : 1);
    }
    validateDocumentAndPosition(params) {
        if (!params ||
            !params.textDocument ||
            !params.textDocument.uri ||
            !params.position) {
            throw new Error('`textDocument`, `textDocument.uri`, and `position` arguments are required.');
        }
    }
    async handleCompletionRequest(params) {
        if (!this._isInitialized || !this._graphQLCache) {
            return [];
        }
        this.validateDocumentAndPosition(params);
        const textDocument = params.textDocument;
        const position = params.position;
        const cachedDocument = this._getCachedDocument(textDocument.uri);
        if (!cachedDocument) {
            throw new Error('A cached document cannot be found.');
        }
        const found = cachedDocument.contents.find(content => {
            const currentRange = content.range;
            if (currentRange && currentRange.containsPosition(position)) {
                return true;
            }
        });
        if (!found) {
            return [];
        }
        const { query, range } = found;
        if (range) {
            position.line -= range.start.line;
        }
        const result = await this._languageService.getAutocompleteSuggestions(query, position, textDocument.uri);
        const project = this._graphQLCache
            .getGraphQLConfig()
            .getProjectForFile(textDocument.uri);
        this._logger.log(JSON.stringify({
            type: 'usage',
            messageType: 'textDocument/completion',
            projectName: project && project.name,
            fileName: textDocument.uri,
        }));
        return { items: result, isIncomplete: false };
    }
    async handleHoverRequest(params) {
        if (!this._isInitialized || !this._graphQLCache) {
            return { contents: [] };
        }
        this.validateDocumentAndPosition(params);
        const textDocument = params.textDocument;
        const position = params.position;
        const cachedDocument = this._getCachedDocument(textDocument.uri);
        if (!cachedDocument) {
            throw new Error('A cached document cannot be found.');
        }
        const found = cachedDocument.contents.find(content => {
            const currentRange = content.range;
            if (currentRange && currentRange.containsPosition(position)) {
                return true;
            }
        });
        if (!found) {
            return { contents: [] };
        }
        const { query, range } = found;
        if (range) {
            position.line -= range.start.line;
        }
        const result = await this._languageService.getHoverInformation(query, position, textDocument.uri);
        return {
            contents: result,
        };
    }
    async handleWatchedFilesChangedNotification(params) {
        if (!this._isInitialized || !this._graphQLCache) {
            return null;
        }
        return Promise.all(params.changes.map(async (change) => {
            if (!this._isInitialized || !this._graphQLCache) {
                throw Error('No cache available for handleWatchedFilesChanged');
            }
            if (change.type === graphql_language_service_types_1.FileChangeTypeKind.Created ||
                change.type === graphql_language_service_types_1.FileChangeTypeKind.Changed) {
                const uri = change.uri;
                const text = fs_1.readFileSync(new url_1.URL(uri).pathname).toString();
                const contents = this._parser(text, uri, this._fileExtensions);
                this._updateFragmentDefinition(uri, contents);
                this._updateObjectTypeDefinition(uri, contents);
                const diagnostics = (await Promise.all(contents.map(async ({ query, range }) => {
                    const results = await this._languageService.getDiagnostics(query, uri);
                    if (results && results.length > 0) {
                        return processDiagnosticsMessage(results, query, range);
                    }
                    else {
                        return [];
                    }
                }))).reduce((left, right) => left.concat(right));
                const project = this._graphQLCache
                    .getGraphQLConfig()
                    .getProjectForFile(uri);
                this._logger.log(JSON.stringify({
                    type: 'usage',
                    messageType: 'workspace/didChangeWatchedFiles',
                    projectName: project && project.name,
                    fileName: uri,
                }));
                return { uri, diagnostics };
            }
            else if (change.type === graphql_language_service_types_1.FileChangeTypeKind.Deleted) {
                this._graphQLCache.updateFragmentDefinitionCache(this._graphQLCache.getGraphQLConfig().dirpath, change.uri, false);
                this._graphQLCache.updateObjectTypeDefinitionCache(this._graphQLCache.getGraphQLConfig().dirpath, change.uri, false);
            }
        }));
    }
    async handleDefinitionRequest(params, _token) {
        if (!this._isInitialized || !this._graphQLCache) {
            return [];
        }
        if (!params || !params.textDocument || !params.position) {
            throw new Error('`textDocument` and `position` arguments are required.');
        }
        const textDocument = params.textDocument;
        const position = params.position;
        const cachedDocument = this._getCachedDocument(textDocument.uri);
        if (!cachedDocument) {
            throw new Error(`${textDocument.uri} is not available.`);
        }
        const found = cachedDocument.contents.find(content => {
            const currentRange = content.range;
            if (currentRange && currentRange.containsPosition(position)) {
                return true;
            }
        });
        if (!found) {
            return [];
        }
        const { query, range } = found;
        if (range) {
            position.line -= range.start.line;
        }
        const result = await this._languageService.getDefinition(query, position, textDocument.uri);
        const formatted = result
            ? result.definitions.map(res => {
                const defRange = res.range;
                return {
                    uri: res.path.indexOf('file://') === 0
                        ? res.path
                        : `file://${res.path}`,
                    range: defRange,
                };
            })
            : [];
        const project = this._graphQLCache
            .getGraphQLConfig()
            .getProjectForFile(textDocument.uri);
        this._logger.log(JSON.stringify({
            type: 'usage',
            messageType: 'textDocument/definition',
            projectName: project && project.name,
            fileName: textDocument.uri,
        }));
        return formatted;
    }
    async handleDocumentSymbolRequest(params) {
        if (!this._isInitialized) {
            return [];
        }
        if (!params || !params.textDocument) {
            throw new Error('`textDocument` argument is required.');
        }
        const textDocument = params.textDocument;
        const cachedDocument = this._getCachedDocument(textDocument.uri);
        if (!cachedDocument) {
            throw new Error('A cached document cannot be found.');
        }
        return this._languageService.getDocumentSymbols(cachedDocument.contents[0].query, textDocument.uri);
    }
    _isRelayCompatMode(query) {
        return (query.indexOf('RelayCompat') !== -1 ||
            query.indexOf('react-relay/compat') !== -1);
    }
    async _updateFragmentDefinition(uri, contents) {
        const rootDir = this._graphQLCache.getGraphQLConfig().dirpath;
        await this._graphQLCache.updateFragmentDefinition(rootDir, new url_1.URL(uri).pathname, contents);
    }
    async _updateObjectTypeDefinition(uri, contents) {
        const rootDir = this._graphQLCache.getGraphQLConfig().dirpath;
        await this._graphQLCache.updateObjectTypeDefinition(rootDir, new url_1.URL(uri).pathname, contents);
    }
    _getCachedDocument(uri) {
        if (this._textDocumentCache.has(uri)) {
            const cachedDocument = this._textDocumentCache.get(uri);
            if (cachedDocument) {
                return cachedDocument;
            }
        }
        return null;
    }
    _invalidateCache(textDocument, uri, contents) {
        if (this._textDocumentCache.has(uri)) {
            const cachedDocument = this._textDocumentCache.get(uri);
            if (cachedDocument &&
                textDocument.version &&
                cachedDocument.version < textDocument.version) {
                this._textDocumentCache.set(uri, {
                    version: textDocument.version,
                    contents,
                });
            }
        }
        else if (textDocument.version) {
            this._textDocumentCache.set(uri, {
                version: textDocument.version,
                contents,
            });
        }
    }
}
exports.MessageProcessor = MessageProcessor;
function processDiagnosticsMessage(results, query, range) {
    const queryLines = query.split('\n');
    const totalLines = queryLines.length;
    const lastLineLength = queryLines[totalLines - 1].length;
    const lastCharacterPosition = new graphql_language_service_utils_1.Position(totalLines, lastLineLength);
    const processedResults = results.filter(diagnostic => diagnostic.range.end.lessThanOrEqualTo(lastCharacterPosition));
    if (range) {
        const offset = range.start;
        return processedResults.map(diagnostic => (Object.assign(Object.assign({}, diagnostic), { range: new graphql_language_service_utils_1.Range(new graphql_language_service_utils_1.Position(diagnostic.range.start.line + offset.line, diagnostic.range.start.character), new graphql_language_service_utils_1.Position(diagnostic.range.end.line + offset.line, diagnostic.range.end.character)) })));
    }
    return processedResults;
}
//# sourceMappingURL=MessageProcessor.js.map