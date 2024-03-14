import { time } from 'console';
import {
    ApiServer,
    ApiServerOptions
} from './api/index.js';

import {
    PodBay
} from './db/index.js';
import { IdReferenceType } from './utils/constants.js';

import {
    Config,
    IdReference,
    LogBooksManager,
    LogLevel,
    loadConfig,
    logBooksManager,
    logger,
} from './utils/index.js';

let nameType: IdReferenceType | string = IdReferenceType.NAME;
let loadedConfig = await loadConfig();

/**
 * The main class for the Moonbase
 * @class
 * @classdesc The main class for the Moonbase
 * @property {ApiServer} api - The API server
 * @property {PodBay} podBay - The pod bay
 * @property {Config} config - The configuration
 * @property {LogBooksManager} logs - The log books manager
 * @public
 */
class Moonbase {
    public api: ApiServer;
    public podBay: PodBay;
    public config: Config;
    public logs: LogBooksManager = logBooksManager;

    constructor(
        config?: Config
    ) {
        this.podBay = new PodBay();
        this.config = loadedConfig

        console.log('Config data after loadConfig:', this.config.general.names, this.config.logs.level, this.config.logs.dir, this.config.server.port);
        this.logs.init(this.config.logs);

        nameType = this.config.general.names;

        const options = new ApiServerOptions({
            port: this.config.server.port,
            podBay: this.podBay
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
     * @method
     * @public
     * @returns {void}
     * @summary Initialize the Moonbase
     */
    public init() {
        this.api.start();
    }
}

// while (loadedConfig === null || loadedConfig === undefined) {
//     setTimeout(() => {
//         console.log('Waiting for config to load...');
//     }, 100);
// }
const moonbase = new Moonbase();
moonbase.init();

export {
    Moonbase,
    moonbase,
    nameType
}

export * from './utils/index.js';
export * from './db/index.js';
