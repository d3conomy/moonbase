import { ApiServer } from './api/index.js';
import { PodBay } from './db/index.js';
import { Config, LogBooksManager } from './utils/index.js';
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
export { Moonbase, };
export * from './utils/index.js';
export * from './db/index.js';
export * from './api/index.js';
//# sourceMappingURL=index.d.ts.map