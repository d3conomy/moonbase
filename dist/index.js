import { ApiServer, ApiServerOptions } from './api/index.js';
import { PodBay } from './db/index.js';
import { LogLevel, loadConfig, logBooksManager, logger, } from './utils/index.js';
/**
 * The main class for the Moonbase
 * @category Moonbase
 */
class Moonbase {
    api;
    podBay;
    config;
    logs = logBooksManager;
    constructor(config) {
        this.config = config ? config : loadedConfig;
        loadedConfig = this.config;
        this.logs.init(this.config.logs);
        const podBayOptions = {
            nameType: this.config.general.names,
            pods: this.config?.pods,
        };
        this.podBay = new PodBay(podBayOptions);
        const options = new ApiServerOptions({
            port: this.config.api.port,
            podBay: this.podBay,
            corsOrigin: this.config.api.corsOrigin
        });
        if (!options) {
            const message = 'Failed to create ApiServerOptions';
            logger({
                level: LogLevel.ERROR,
                message
            });
            throw new Error(message);
        }
        this.api = new ApiServer(options);
    }
    /**
     * Initialize the Moonbase
     */
    init() {
        this.api.start();
    }
}
let loadedConfig = await loadConfig();
while (loadedConfig === null || loadedConfig === undefined) {
    setTimeout(() => {
        console.log('Waiting for config to load...');
    }, 100);
}
export { Moonbase,
// moonbase
 };
export * from './utils/index.js';
export * from './db/index.js';
export * from './api/index.js';
