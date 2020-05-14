import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api';
const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000;
export class WorkerManager {
    constructor(defaults) {
        this._defaults = defaults;
        this._worker = null;
        this._idleCheckInterval = setInterval(() => this._checkIfIdle(), 30 * 1000);
        this._lastUsedTime = 0;
        this._configChangeListener = this._defaults.onDidChange(() => this._stopWorker());
        this._client = null;
    }
    _stopWorker() {
        if (this._worker) {
            this._worker.dispose();
            this._worker = null;
        }
        this._client = null;
    }
    dispose() {
        clearInterval(this._idleCheckInterval);
        this._configChangeListener.dispose();
        this._stopWorker();
    }
    _checkIfIdle() {
        if (!this._worker) {
            return;
        }
        const timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
        if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
            this._stopWorker();
        }
    }
    async _getClient() {
        this._lastUsedTime = Date.now();
        if (!this._client) {
            this._worker = monacoEditor.createWebWorker({
                moduleId: 'vs/language/graphql/graphqlWorker',
                label: this._defaults.languageId,
                createData: {
                    languageId: this._defaults.languageId,
                    formattingOptions: this._defaults.formattingOptions,
                    schemaConfig: this._defaults.schemaConfig,
                },
            });
            try {
                this._client = await this._worker.getProxy();
            }
            catch (error) {
                throw Error('Error loading serviceworker proxy');
            }
        }
        return this._client;
    }
    async getLanguageServiceWorker(...resources) {
        const client = await this._getClient();
        await this._worker.withSyncedResources(resources);
        return client;
    }
}
//# sourceMappingURL=workerManager.js.map