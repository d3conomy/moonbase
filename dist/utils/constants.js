var Component;
(function (Component) {
    Component["DB"] = "db";
    Component["IPFS"] = "ipfs";
    Component["LIBP2P"] = "libp2p";
    Component["ORBITDB"] = "orbitdb";
    Component["SYSTEM"] = "system";
})(Component || (Component = {}));
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (LogLevel = {}));
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["SUCCESS"] = 200] = "SUCCESS";
    ResponseCode[ResponseCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    ResponseCode[ResponseCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ResponseCode[ResponseCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    ResponseCode[ResponseCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ResponseCode[ResponseCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    ResponseCode[ResponseCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    ResponseCode[ResponseCode["UNKNOWN"] = 520] = "UNKNOWN";
})(ResponseCode || (ResponseCode = {}));
var WorkStatus;
(function (WorkStatus) {
    WorkStatus["NEW"] = "new";
    WorkStatus["INIT"] = "init";
    WorkStatus["STARTED"] = "started";
    WorkStatus["PENDING"] = "pending";
    WorkStatus["COMPLETED"] = "completed";
    WorkStatus["STOPPED"] = "stopped";
    WorkStatus["ERROR"] = "error";
    WorkStatus["WARNING"] = "warning";
})(WorkStatus || (WorkStatus = {}));
export { ResponseCode, Component, LogLevel, WorkStatus };
