enum Component {
    DB = 'OpenDb',
    IPFS = 'IPFS',
    LIBP2P = 'Libp2p',
    ORBITDB = 'OrbitDb',
    SYSTEM = 'System'
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

enum WorkStatus {
    NEW = 'new',
    INIT = 'init',
    STARTED = 'started',
    PENDING = 'pending',
    COMPLETED = 'completed',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning'
}

export {
    ResponseCode,
    Component,
    LogLevel,
    WorkStatus
}