enum Component {
    DB = 'db',
    IPFS = 'ipfs',
    LIBP2P = 'libp2p',
    ORBITDB = 'orbitdb',
    SYSTEM = 'system'
}

enum LogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    DEBUG = 'debug'
}

enum ResponseCode {
    SUCCESS = 200,
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
    FINISHED = 'finished',
    STOPPED = 'stopped',
    ERROR = 'error',
    WARNING = 'warning',
    DONE = 'done'
}

export {
    ResponseCode,
    Component,
    LogLevel,
    WorkStatus
}