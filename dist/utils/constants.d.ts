import { LunarPod } from '../db/pod.js';
/**
 * Moonbase Components
 * @category Moonbase
 */
declare enum Component {
    DB = "opendb",
    IPFS = "ipfs",
    LIBP2P = "libp2p",
    ORBITDB = "orbitdb",
    PROCESS = "process",
    POD = "pod",
    SYSTEM = "system"
}
/**
 * Check if a string is a valid component
 * @category Moonbase
 */
declare const isComponent: (component: string) => Component;
/**
 * Log Levels
 * @category Logging
 */
declare enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug"
}
/**
 * Check if a string is a valid log level
 * @category Utils
 */
declare const isLogLevel: (level?: string | LogLevel) => LogLevel;
/**
 * Id Reference Types
 * @category Utils
 */
declare enum IdReferenceType {
    UUID = "uuid",
    NAME = "name",
    STRING = "string"
}
/**
 * Check if a string is a valid id reference type
 * @category Utils
 */
declare const isIdReferenceType: (type?: string) => IdReferenceType;
/**
 * Response Codes
 * @category API
 * @description Response codes for API
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
declare enum ResponseCode {
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
/**
 * Lunar Pod Process Stages
 * @category Process
 */
declare enum ProcessStage {
    NEW = "new",
    INIT = "init",
    STARTED = "started",
    STARTING = "starting",
    PENDING = "pending",
    COMPLETED = "completed",
    STOPPING = "stopping",
    STOPPED = "stopped",
    ERROR = "error",
    WARNING = "warning",
    UNKNOWN = "unknown"
}
/**
 * Check if a string is a valid process stage
 * @category Process
 */
declare const isProcessStage: (stage: string) => ProcessStage;
/**
 * Configuration class for moonbase
 * @category Moonbase
 */
declare class Config {
    /**
     * Configure logging
     * @default level "info"
     * @default dir "./logs"
     */
    logs: {
        level: string;
        dir: string;
    };
    /**
     * General configuration
     * @default names "uuid"
     * @example
     * { "names": "uuid" | "name" | "string" }
     */
    general: {
        names: string;
    };
    /**
     * API configuration
     * @default port 4343
     * @default corsOrigin "*"
     * @example
     * { "port": 4343, "corsOrigin": "*" }
     */
    api: {
        port: number;
        corsOrigin: string;
    };
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
    pods?: Array<LunarPod>;
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
    constructor(config?: any);
}
/**
 * Load configuration
 * @description Load configuration from config.json file.
 *  The default location for the config.json file is the root of the project.
 * @category Moonbase
 */
declare const loadConfig: () => Promise<Config>;
export { ResponseCode, Component, isComponent, LogLevel, isLogLevel, IdReferenceType, isIdReferenceType, ProcessStage, isProcessStage, Config, loadConfig };
//# sourceMappingURL=constants.d.ts.map