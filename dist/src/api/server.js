import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { 
// libp2pRouter,
metricsRouter,
// ipfsRouter,
// orbitdbRouter
 } from './routes/index.js';
const defaultRouters = [
    // libp2pRouter,
    // ipfsRouter,
    // orbitdbRouter,
    metricsRouter
];
class ApiServerOptions {
    port;
    routers;
    constructor(routers, port) {
        this.port = port ? port : 3000;
        this.routers = routers ? routers : defaultRouters;
    }
}
class ApiServer {
    app;
    port;
    routers;
    constructor(options) {
        this.port = options?.port || 3000;
        this.app = express();
        this.routers = options?.routers || [];
    }
    init() {
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
        this.app.use('/api/v0', metricsRouter);
        this.app.use('/api/v0/docs', swaggerUi.serve);
        this.app.get('/api/v0/docs', swaggerUi.setup(specs, { explorer: true }));
    }
    start() {
        this.init();
        this.app.listen(this.port, () => {
            console.log(`API Server is running on port ${this.port}`);
        });
    }
}
export { ApiServer, ApiServerOptions };
