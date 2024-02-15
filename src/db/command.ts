import {
    createProcessId,
    createRandomId
} from "../utils/index.js"

import {
    LogLevel,
    ResponseCode,
    WorkStatus
} from "../utils/constants.js"

import {
    logger
} from "../utils/logBook.js"

interface ICommandProperties {
    action: string
    args?: Array<string>
    kwargs?: Map<string, string>
    timeout?: number
}

class CommandProperties
    implements ICommandProperties
{
    action: string
    args: Array<string>
    kwargs: Map<string, string>
    timeout: number

    constructor({
        action,
        args,
        kwargs,
        timeout
    }: {
        action: string,
        args?: Array<string>,
        kwargs?: Map<string, string>,
        timeout?: number
    }) {
        this.action = action
        this.args = args ? args : new Array<string>()
        this.kwargs = kwargs ? kwargs : new Map<string, string>()
        this.timeout = timeout ? timeout : 5000
    }
}

interface ICommandResponse<T> {
    data?: T
    status?: WorkStatus
    responseCode?: ResponseCode
    message?: string
}


interface ICommand {
    processId?: string
    process: ICommandProperties
    output?: ICommandResponse<any>
}

class Command 
    implements ICommand
{
    processId: string
    process: ICommandProperties
    output: ICommandResponse<any>

    constructor(
        process: ICommandProperties,
        processId: string
    ) {
        this.processId = processId
        this.process = process
        this.output = {
            status: WorkStatus.PENDING,
            responseCode: ResponseCode.UNKNOWN,
            message: 'Command is pending'
        }
    }
}


export {
    ICommand,
    ICommandProperties,
    ICommandResponse,
    Command,
    CommandProperties
}