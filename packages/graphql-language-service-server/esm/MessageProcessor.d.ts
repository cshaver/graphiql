import { CachedContent, GraphQLCache, Uri, GraphQLConfig } from 'graphql-language-service-types';
import { GraphQLLanguageService } from 'graphql-language-service-interface';
import { CompletionParams, VersionedTextDocumentIdentifier, DidSaveTextDocumentParams, DidOpenTextDocumentParams } from 'vscode-languageserver-protocol';
import { CompletionItem, CompletionList, CancellationToken, Hover, InitializeResult, Location, PublishDiagnosticsParams, DidChangeTextDocumentParams, DidCloseTextDocumentParams, DidChangeWatchedFilesParams, InitializeParams, TextDocumentPositionParams, DocumentSymbolParams, SymbolInformation } from 'vscode-languageserver';
import { parseDocument } from './parseDocument';
import { Logger } from './Logger';
declare type CachedDocumentType = {
    version: number;
    contents: CachedContent[];
};
export declare class MessageProcessor {
    _graphQLCache: GraphQLCache;
    _graphQLConfig: GraphQLConfig | undefined;
    _languageService: GraphQLLanguageService;
    _textDocumentCache: Map<string, CachedDocumentType>;
    _isInitialized: boolean;
    _willShutdown: boolean;
    _logger: Logger;
    _extensions?: Array<(config: GraphQLConfig) => GraphQLConfig>;
    _fileExtensions?: Array<string>;
    _parser: typeof parseDocument;
    constructor(logger: Logger, extensions?: Array<(config: GraphQLConfig) => GraphQLConfig>, config?: GraphQLConfig, parser?: typeof parseDocument, fileExtensions?: string[]);
    handleInitializeRequest(params: InitializeParams, _token?: CancellationToken, configDir?: string): Promise<InitializeResult>;
    handleDidOpenOrSaveNotification(params: DidSaveTextDocumentParams | DidOpenTextDocumentParams): Promise<PublishDiagnosticsParams | null>;
    handleDidChangeNotification(params: DidChangeTextDocumentParams): Promise<PublishDiagnosticsParams | null>;
    handleDidCloseNotification(params: DidCloseTextDocumentParams): void;
    handleShutdownRequest(): void;
    handleExitNotification(): void;
    validateDocumentAndPosition(params: CompletionParams): void;
    handleCompletionRequest(params: CompletionParams): Promise<CompletionList | Array<CompletionItem>>;
    handleHoverRequest(params: TextDocumentPositionParams): Promise<Hover>;
    handleWatchedFilesChangedNotification(params: DidChangeWatchedFilesParams): Promise<Array<PublishDiagnosticsParams | undefined> | null>;
    handleDefinitionRequest(params: TextDocumentPositionParams, _token?: CancellationToken): Promise<Array<Location>>;
    handleDocumentSymbolRequest(params: DocumentSymbolParams): Promise<Array<SymbolInformation>>;
    _isRelayCompatMode(query: string): boolean;
    _updateFragmentDefinition(uri: Uri, contents: CachedContent[]): Promise<void>;
    _updateObjectTypeDefinition(uri: Uri, contents: CachedContent[]): Promise<void>;
    _getCachedDocument(uri: string): CachedDocumentType | null;
    _invalidateCache(textDocument: VersionedTextDocumentIdentifier, uri: Uri, contents: CachedContent[]): void;
}
export {};
//# sourceMappingURL=MessageProcessor.d.ts.map