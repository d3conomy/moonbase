"use strict";
// import fs from 'fs/promises';
// import path from 'path';
// import { LogLevel } from 'd3-artifacts';
// /**
//  * Configuration class for moonbase
//  * @category Moonbase
//  */
// class Config {
//     /**
//      * Configure logging
//      * @default level "info"
//      * @default dir "./logs"
//      */
//     public logs: {
//         level: string,
//         dir: string,
//     }
//     /**
//      * General configuration
//      * @default names "uuid"
//      * @example
//      * { "names": "uuid" | "name" | "string" }
//      */
//     public general: {
//         names: string
//     }
//     /**
//      * API configuration
//      * @default port 4343
//      * @default corsOrigin "*"
//      * @example
//      * { "port": 4343, "corsOrigin": "*" }
//      */
//     public api: {
//         port: number
//         corsOrigin: string
//     }
//     /**
//      * Lunar Pods to include in the system
//      * @description Array of LunarPods to include in the system
//      * @default Array<LunarPod>
//      * @example
//      * const myPods = new Array<LunarPod>([
//         SystemPod,
//         AuthPod,
//         UserInfoPod
//     ])
//      * pods = myPods
//      */
//     public pods?: Array<LunarPod> = undefined
//     /**
//      * Creates a new instance of the Config class
//      * @description Can take a configuration object as an argument.
//      *  This will override the default configuration.
//      *  Environment variables will override the configuration object and the default configuration.
//      * @example
//      * const config = new Config({
//         "logs": { "level": "info", "dir": "./logs" },
//         "general": { "names": "uuid" },
//         "api": { "port": 4343, "corsOrigin": "*" } 
//     })
//      */
//     constructor(config?: any) {
//         this.logs = {
//             level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : config?.logs?.level || LogLevel.INFO,
//             dir: process.env.LOG_DIR ? process.env.LOG_DIR : config?.logs?.dir || "./logs",
//         }
//         this.general = {
//             names: process.env.NAMES ? process.env.NAMES : config?.general?.names || IdReferenceType.UUID
//         }
//         this.api = {
//             port: process.env.PORT ? process.env.PORT : config?.server?.port  || 4343,
//             corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : config?.api?.corsOrigin || '*'
//         }
//         this.pods = config?.pods;
//     }
// }
// /**
//  * Load configuration
//  * @description Load configuration from config.json file.
//  *  The default location for the config.json file is the root of the project.
//  * @category Moonbase
//  */
// const loadConfig = async (): Promise<Config> => {
//     const __dirname = path.resolve();
//     const configPath = path.join(__dirname, './config.json');
//     let config;
//     try {
//         const data = await fs.readFile(configPath, 'utf8');
//         config = new Config(JSON.parse(data));
//         logger({
//             level: LogLevel.DEBUG,
//             message: `Config data: ${config.general.names} ${config.logs.level} ${config.logs.dir} ${config.api.port}`
//         });
//     } catch (err: any) {
//         const mesg = `Using default configuation - Error reading file from disk: ${err}`;
//         logger({
//             level: LogLevel.WARN,
//             message: mesg,
//             error: err
//         });
//         config = new Config();
//     }
//     return config;
// }
// export {
//     Config,
//     loadConfig
// }
