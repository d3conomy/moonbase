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
    throw new Error('Invalid process stage');
}

export {
    ResponseCode,
    Component,
    isComponent,
    LogLevel,
    ProcessStage,
    isProcessStage
}