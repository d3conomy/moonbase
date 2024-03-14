import express, { Request, Response, NextFunction} from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import {
    podBayRouter,
    metricsRouter,
    dbRouter
} from './routes/index.js';
import { logger } from '../utils/logBook.js';
import { LogLevel } from '../utils/constants.js';
import { PodBay } from '../db/index.js';

let actievPodBay: PodBay;

/**
* The default routers for the API server
* @type {Array<express.Router>}
* @const
* @default
*/
const defaultRouters = [
    dbRouter,
    podBayRouter,
    metricsRouter
]

declare global {
    namespace Express {
        interface Request {
            podBay?: PodBay;
        }
    }
}

declare module 'express-serve-static-core' {
    interface Request {
        podBay: PodBay;
    }
}

/**
 * The options for the API server
 * @class
 * @classdesc The options for the API server
 * @property {number} port - The port for the API server to listen on
 * @public
 * @default port: 3000
 */
class ApiServerOptions {
    public podBay: PodBay;
    public port: number;

    public constructor({
        podBay,
        port
    }: {
        podBay?: PodBay,
        port?: number
    }) {
        if (!podBay) {
            throw new Error('ApiServerOptions requires a PodBay');
        }
        this.podBay = podBay;
        this.port = port ? port : 3000;
    }
}


/**
 * The API server
 * @class
 * @classdesc The API server
 * @property {express.Application} app - The express application
 * @property {number} port - The port for the API server to listen on
 * @public
 */
class ApiServer {
    public app: express.Application;
    public port: number;

    constructor(
        options: ApiServerOptions,
    ) {
        this.port = options?.port || 3000;
        this.app = express();

        if (options?.podBay) {
            actievPodBay = options.podBay;
        }
    }

    /**
     * Initializes the API server
     * @public
     * @returns {void}
     * @method
     * @memberof ApiServer
     * @summary '''Initializes the API server'''
     * @description '''Initializes the API server'''
     */
    public init() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Moonbase API',
                    version: '0.0.1',
                },
                servers: [
                    {
                        url: `http://0.0.0.0:${this.port}`,
                        description: 'Development server',
                    },
                ],
                consumes: ['application/json'],
                produces: ['application/json']
                // host: url, // Host (optional)
            },
            // Path to the API docs
            apis: [
                './src/api/routes/*.ts',
                './src/api/models/*.ts',
                './dist/api/routes/*.js',
                './dist/api/models/*.js'
            ]
        };

        const corsOptions = {
            origin: 'http://localhost:3001',
            optionsSuccessStatus: 200
        }

        this.app.use(cors(corsOptions));

        const podBayMiddleware = (req: Request, _res: Response, next: NextFunction) => {
            req.podBay = actievPodBay;
            next();
        }

        this.app.use(express.json());
        this.app.use('/api/v0',
            podBayMiddleware,
            metricsRouter,
            podBayRouter,
            dbRouter
        );

        const specs = swaggerJsdoc(options);
        this.app.use('/api/v0/docs', swaggerUi.serve);
        this.app.get('/api/v0/docs', swaggerUi.setup(specs, { explorer: true }));

        this.app.use(function (err: Error, req: Request, res: Response, next: NextFunction): void {
            res.status(500).send(res);
        });
    }

    /**
     * Starts the API server
     * @public
     * @returns {void}
     * @method
     * @memberof ApiServer
     * @summary '''Starts the API server'''
     * @description '''Starts the API server'''
     */
    public start() {
        this.init()
        this.app.listen(this.port, () => {
            logger({
                level: LogLevel.INFO,
                message: `API Server listening on port ${this.port}`
            });
        })
    }
}

export {
    actievPodBay,
    ApiServer,
    ApiServerOptions
}