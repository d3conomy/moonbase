import fs from 'fs/promises';
import path from 'path';
import { logger } from './logBook.js';
/**
 * Moonbase Components
 * @category Moonbase
 */
var Component;
(function (Component) {
    Component["DB"] = "opendb";
    Component["IPFS"] = "ipfs";
    Component["LIBP2P"] = "libp2p";
    Component["ORBITDB"] = "orbitdb";
    Component["PROCESS"] = "process";
    Component["POD"] = "pod";
    Component["SYSTEM"] = "system";
})(Component || (Component = {}));
/**
 * Check if a string is a valid component
 * @category Moonbase
 */
const isComponent = (component) => {
    if (Object.values(Component).includes(component)) {
        return component;
    }
    throw new Error('Invalid component');
};
/**
 * Log Levels
 * @category Logging
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
/**
 * Check if a string is a valid log level
 * @category Utils
 */
const isLogLevel = (level) => {
    if (Object.values(LogLevel).includes(level)) {
        return level;
    }
    throw new Error('Invalid log level');
};
/**
 * Id Reference Types
 * @category Utils
 */
var IdReferenceType;
(function (IdReferenceType) {
    IdReferenceType["UUID"] = "uuid";
    IdReferenceType["NAME"] = "name";
    IdReferenceType["STRING"] = "string";
})(IdReferenceType || (IdReferenceType = {}));
/**
 * Check if a string is a valid id reference type
 * @category Utils
 */
const isIdReferenceType = (type) => {
    if (Object.values(IdReferenceType).includes(type)) {
        return type;
    }
    else if (type === undefined) {
        return IdReferenceType.UUID;
    }
    throw new Error('Invalid id reference type');
};
/**
 * Response Codes
 * @category API
 * @description Response codes for API
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["SUCCESS"] = 200] = "SUCCESS";
    ResponseCode[ResponseCode["FAILURE"] = 300] = "FAILURE";
    ResponseCode[ResponseCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseCode[ResponseCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseCode[ResponseCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseCode[ResponseCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseCode[ResponseCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ResponseCode[ResponseCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    ResponseCode[ResponseCode["UNKNOWN"] = 520] = "UNKNOWN";
})(ResponseCode || (ResponseCode = {}));
/**
 * Lunar Pod Process Stages
 * @category Process
 */
var ProcessStage;
(function (ProcessStage) {
    ProcessStage["NEW"] = "new";
    ProcessStage["INIT"] = "init";
    ProcessStage["STARTED"] = "started";
    ProcessStage["STARTING"] = "starting";
    ProcessStage["PENDING"] = "pending";
    ProcessStage["COMPLETED"] = "completed";
    ProcessStage["STOPPING"] = "stopping";
    ProcessStage["STOPPED"] = "stopped";
    ProcessStage["ERROR"] = "error";
    ProcessStage["WARNING"] = "warning";
    ProcessStage["UNKNOWN"] = "unknown";
})(ProcessStage || (ProcessStage = {}));
/**
 * Check if a string is a valid process stage
 * @category Process
 */
const isProcessStage = (stage) => {
    if (Object.values(ProcessStage).includes(stage)) {
        return stage;
    }
    else if (stage === undefined) {
        return ProcessStage.UNKNOWN;
    }
    throw new Error('Invalid process stage');
};
/**
 * Configuration class for moonbase
 * @category Moonbase
 */
class Config {
    /**
     * Configure logging
     * @default level "info"
     * @default dir "./logs"
     */
    logs;
    /**
     * General configuration
     * @default names "uuid"
     * @example
     * { "names": "uuid" | "name" | "string" }
     */
    general;
    /**
     * API configuration
     * @default port 4343
     * @default corsOrigin "*"
     * @example
     * { "port": 4343, "corsOrigin": "*" }
     */
    api;
    /**
     * Lunar Pods to include in the system
     * @description Array of LunarPods to include in the system
     * @default Array<LunarPod>
     * @example
     * const myPods = new Array<LunarPod>([
        SystemPod,
        AuthPod,
        UserInfoPod
    ])
     * pods = myPods
     */
    pods = undefined;
    /**
     * Creates a new instance of the Config class
     * @description Can take a configuration object as an argument.
     *  This will override the default configuration.
     *  Environment variables will override the configuration object and the default configuration.
     * @example
     * const config = new Config({
        "logs": { "level": "info", "dir": "./logs" },
        "general": { "names": "uuid" },
        "api": { "port": 4343, "corsOrigin": "*" }
    })
     */
    constructor(config) {
        this.logs = {
            level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : config?.logs?.level || LogLevel.INFO,
            dir: process.env.LOG_DIR ? process.env.LOG_DIR : config?.logs?.dir || "./logs",
        };
        this.general = {
            names: process.env.NAMES ? process.env.NAMES : config?.general?.names || IdReferenceType.UUID
        };
        this.api = {
            port: process.env.PORT ? process.env.PORT : config?.server?.port || 4343,
            corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : config?.api?.corsOrigin || '*'
        };
        this.pods = config?.pods;
    }
}
/**
 * Load configuration
 * @description Load configuration from config.json file.
 *  The default location for the config.json file is the root of the project.
 * @category Moonbase
 */
const loadConfig = async () => {
    const __dirname = path.resolve();
    const configPath = path.join(__dirname, './config.json');
    let config;
    try {
        const data = await fs.readFile(configPath, 'utf8');
        config = new Config(JSON.parse(data));
        logger({
            level: LogLevel.DEBUG,
            message: `Config data: ${config.general.names} ${config.logs.level} ${config.logs.dir} ${config.api.port}`
        });
    }
    catch (err) {
        const mesg = `Using default configuation - Error reading file from disk: ${err}`;
        logger({
            level: LogLevel.WARN,
            message: mesg,
            error: err
        });
        config = new Config();
    }
    return config;
};
export { ResponseCode, Component, isComponent, LogLevel, isLogLevel, IdReferenceType, isIdReferenceType, ProcessStage, isProcessStage, Config, loadConfig };
