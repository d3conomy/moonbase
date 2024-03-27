import { ApiServer } from './moonbase-api-server/index.js';
import { PodBay } from './pod-bay/index.js';
import { Config, LogBooksManager } from 'd3-artifacts';
/**
 * The main class for the Moonbase
 * @category Moonbase
 */
declare class Moonbase {
    api: ApiServer;
    podBay: PodBay;
    config: Config;
    logs: LogBooksManager;
    constructor(config?: Config);
    /**
     * Initialize the Moonbase
     */
    init(): void;
}
/**
 * The main instance of the Moonbase
 * @category Moonbase
 */
declare const moonbase: Moonbase;
export { Moonbase, moonbase };
export * from './utils/index.js';
export * from './db/index.js';
export * from './moonbase-api-server/index.js';
//# sourceMappingURL=index.d.ts.map