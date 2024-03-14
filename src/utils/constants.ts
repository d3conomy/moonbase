import fs from 'fs/promises';
import path from 'path';
import { logger } from './logBook.js';

/**
 * Component enum
 * @description Enum for available components
 * @enum {string}
 * @property DB - Database
 * @property IPFS - IPFS
 * @property LIBP2P - Libp2p
 * @property ORBITDB - OrbitDB
 * @property PROCESS - Process
 * @property POD - Pod
 * @property SYSTEM - System
 * @summary '''Enum for available components
 *             DB: Open Database
 *             IPFS: IPFS Process
 *             LIBP2P: Libp2p Process
 *             ORBITDB: OrbitDB Process
 *             PROCESS: Generic or unknown/custom process
 *             POD: Pod managing a set of processes
 *             SYSTEM: System process'''   
 */
enum Component {
    DB = 'opendb',
    IPFS = 'ipfs',
    LIBP2P = 'libp2p',
    ORBITDB = 'orbitdb',
    PROCESS = 'process',
    POD = 'pod',
    SYSTEM = 'system'
}

const isComponent = (component: string): Component => {
    if (Object.values(Component).includes(component as Component)) {
        return component as Component;
    }
    throw new Error('Invalid component');
}

enum LogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    DEBUG = 'debug'
}

const isLogLevel = (level: string): LogLevel => {
    if (Object.values(LogLevel).includes(level as LogLevel)) {
        return level as LogLevel;
    }
    throw new Error('Invalid log level');
}

enum IdReferenceType {
    UUID = 'uuid',
    NAME = 'name',
    STRING = 'string'
}

const isIdReferenceType = (type?: string): IdReferenceType => {
    if (Object.values(IdReferenceType).includes(type as IdReferenceType)) {
        return type as IdReferenceType;
    }
    else if (type === undefined) {
        return IdReferenceType.UUID;
    }
    throw new Error('Invalid id reference type');
}

enum ResponseCode {
    SUCCESS = 200,
    FAILURE = 300,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    UNKNOWN = 520
}

enum ProcessStage {
    NEW = 'new',
    INIT = 'init',
    STARTED = 'started',
    STARTING = 'starting',
    PENDING = 'pending',
    COMPLETED = 'completed',
    STOPPING = 'stopping',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning',
    UNKNOWN = 'unknown',
}

const isProcessStage = (stage: string): ProcessStage => {
    if (Object.values(ProcessStage).includes(stage as ProcessStage)) {
        return stage as ProcessStage;
    }
    else if (stage === undefined) {
        return ProcessStage.UNKNOWN;
    }
    throw new Error('Invalid process stage');
}


/**
 * Configuration class
 * @description Configuration class for moonbase
 * @class Config
 * @property logs - Configuration for logs
 * @property server - Configuration for server
 * @property general - General configuration
 * @method constructor - Constructor for Config
 * @summary '''Configuration class for moonbase
 *             ENV variables override config.json
 *             LOG_LEVEL: info | warn | error | debug
 *             LOG_DIR: path to log directory
 *             LOG_NAMES: uuid | name
 *             PORT: Moonbase API server port number'''
 */
class Config {
    public logs: {
        level: string,
        dir: string,
    }
    public general: {
        names: string
    }
    public server: {
        port: number
    }

    // env variables override config.json
    constructor(config?: any) {
        this.logs = {
            level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : config?.logs?.level || LogLevel.INFO,
            dir: process.env.LOG_DIR ? process.env.LOG_DIR : config?.logs?.dir || "./logs",
        }
        this.general = {
            names: process.env.NAMES ? process.env.NAMES : config?.general?.names || IdReferenceType.UUID
        }
        this.server = {
            port: process.env.PORT ? process.env.PORT : config?.server?.port  || 3000
        }
    }
}

/**
 * Load configuration
 * @description Load configuration from config.json
 * @function loadConfig
 * @returns {Config} - Configuration object
 */
const loadConfig = async (): Promise<Config> => {
    const __dirname = path.resolve();
    const configPath = path.join(__dirname, './config.json');

    let config;

    try {
        const data = await fs.readFile(configPath, 'utf8');
        // parse JSON string to JSON object
        config = new Config(JSON.parse(data));
        console.log('Config data after parsing json data from file:', config.general.names, config.logs.level, config.logs.dir, config.server.port);
        // print all data
        logger({
            level: LogLevel.DEBUG,
            message: `Config data: ${config.general.names} ${config.logs.level} ${config.logs.dir} ${config.server.port}`
        });
    } catch (err: any) {
        const mesg = `Using default configuation - Error reading file from disk: ${err}`;
        logger({
            level: LogLevel.WARN,
            message: mesg,
            error: err
        });
        config = new Config();
    }
    return config;
}

export {
    ResponseCode,
    Component,
    isComponent,
    LogLevel,
    isLogLevel,
    IdReferenceType,
    isIdReferenceType,
    ProcessStage,
    isProcessStage,
    Config,
    loadConfig
}