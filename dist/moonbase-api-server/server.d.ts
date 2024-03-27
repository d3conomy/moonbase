import express from 'express';
import { PodBay } from '../pod-bay/index.js';
/**
 * The active podBay
 */
declare global {
    namespace Express {
        interface Request {
            podBay?: PodBay;
        }
    }
}
/**
 * The active podBay
 */
declare module 'express-serve-static-core' {
    interface Request {
        podBay: PodBay;
    }
}
/**
 * The options for the API server
 * @category API
 */
declare class ApiServerOptions {
    podBay: PodBay;
    port: number;
    corsOrigin: string;
    constructor({ podBay, port, corsOrigin }: {
        podBay?: PodBay;
        port?: number;
        corsOrigin?: string;
    });
}
/**
 * The API server
 * @category API
 */
declare class ApiServer {
    app: express.Application;
    options: {
        port: number;
        corsOrigin: string;
        podBay: PodBay;
    };
    constructor(options: ApiServerOptions);
    /**
     * Initializes the API server
     */
    init(): void;
    /**
     * Starts the API server
     */
    start(): void;
}
export { ApiServer, ApiServerOptions };
//# sourceMappingURL=server.d.ts.map