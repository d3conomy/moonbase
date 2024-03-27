import express, { Request, Response, NextFunction} from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import {
    podBayRouter,
    metricsRouter,
    dbRouter
} from './routes/index.js';
import { LogLevel, logger } from 'd3-artifacts';
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
class ApiServerOptions {
    public podBay: PodBay;
    public port: number;
    public corsOrigin: string;

    public constructor({
        podBay,
        port,
        corsOrigin
    }: {
        podBay?: PodBay,
        port?: number,
        corsOrigin?: string
    }) {
        if (!podBay) {
            throw new Error('ApiServerOptions requires a PodBay');
        }
        this.podBay = podBay;
        this.port = port ? port : 4343;
        this.corsOrigin = corsOrigin ? corsOrigin : '*';
    }
}


/**
 * The API server
 * @category API
 */
class ApiServer {
    public app: express.Application;
    public options: {
        port: number,
        corsOrigin: string
        podBay: PodBay
    }

    constructor(
        options: ApiServerOptions,
    ) {
        this.app = express();
        this.options = {
            port: options.port,
            corsOrigin: options.corsOrigin,
            podBay: options.podBay
        }
    }

    /**
     * Initializes the API server
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
                        url: `http://0.0.0.0:${this.options.port}`,
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
            origin: this.options.corsOrigin,
            optionsSuccessStatus: 200
        }

        this.app.use(cors(corsOptions));

        const podBayMiddleware = (req: Request, _res: Response, next: NextFunction) => {
            req.podBay = this.options.podBay;
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
     */
    public start() {
        this.init()
        this.app.listen(this.options.port, () => {
            logger({
                level: LogLevel.INFO,
                message: `Moonbase🌙⛺️ API Server listening on port ${this.options.port} `
            });
        })
    }
}

export {
    ApiServer,
    ApiServerOptions
}