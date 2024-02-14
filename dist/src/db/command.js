import { createRandomId } from "../utils";
import { ResponseCode, WorkStatus } from "../utils/constants";
class CommandProperties {
    action;
    args;
    kwargs;
    timeout;
    constructor(action, args, kwargs, timeout) {
        this.action = action;
        this.args = args ? args : new Array();
        this.kwargs = kwargs ? kwargs : new Map();
        this.timeout = timeout ? timeout : 5000;
    }
}
class CommandCall {
    process;
    action;
    args;
    kwargs;
    timeout;
    constructor(process, action, args, kwargs, timeout) {
        this.process = process;
        this.action = action;
        this.args = args ? args : new Array();
        this.kwargs = kwargs ? kwargs : new Map();
        this.timeout = timeout ? timeout : 5000;
    }
}
class Command {
    processId;
    call;
    output;
    constructor(call) {
        this.processId = createRandomId();
        this.call = call;
        this.output = {
            status: WorkStatus.PENDING,
            responseCode: ResponseCode.UNKNOWN,
            message: 'Command is pending'
        };
    }
    execute() {
        let dataOutput;
        this.call.process(...this.call.args, this.call.kwargs).then((data) => {
            dataOutput = data;
        }).catch((error) => {
            try {
                dataOutput = this.call.process;
            }
            catch (e) {
                dataOutput = error;
            }
        });
        return {
            data: dataOutput,
            status: WorkStatus.COMPLETED,
            responseCode: ResponseCode.SUCCESS,
            message: `[${this.processId}] Command executed: ${this.call.action}`
        };
    }
}
export { Command, CommandCall, CommandProperties };
