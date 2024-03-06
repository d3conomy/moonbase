import express, { Request, Response, NextFunction} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import {
    // libp2pRouter,
    podBayRouter,
    metricsRouter,
    // ipfsRouter,
    // orbitdbRouter
} from './routes/index.js';

const defaultRouters = [
    // libp2pRouter,
    // ipfsRouter,
    // orbitdbRouter,
    podBayRouter,
    metricsRouter
]


class ApiServerOptions {
    public port: number;
    public routers: express.Router[];

    public constructor(
        routers?: express.Router[],
        port?: number
    ) {
        this.port = port ? port : 3000;
        this.routers = routers ? routers : defaultRouters;
    }
}


class ApiServer {
    public app: express.Application;
    public port: number;
    private routers: express.Router[];

    constructor(
        options?: ApiServerOptions,
    ) {
        this.port = options?.port || 3000;
        this.app = express();
        this.routers = options?.routers || [];
    }

    public init() {

        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'OrbitDB API',
                    version: '0.0.1',
                },
                servers: [
                    {
                        url: 'http://0.0.0.0:3000',
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

        const specs = swaggerJsdoc(options);

        this.app.use(express.json());
        this.app.use('/api/v0',
            metricsRouter,
            podBayRouter
        );
        this.app.use('/api/v0/docs', swaggerUi.serve);
        this.app.get('/api/v0/docs', swaggerUi.setup(specs, { explorer: true }));

        this.app.use(function (err: Error, req: Request, res: Response, next: NextFunction): void {
            res.status(500).send(err);
        });
    }

    public start() {
        this.init()
        this.app.listen(this.port, () => {
            console.log(`API Server is running on port ${this.port}`);
        })
    }
}

export {
    ApiServer,
    ApiServerOptions
}