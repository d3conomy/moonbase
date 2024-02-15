import {
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
    arg?: Array<string>
    kwarg?: Map<string, string>
    timeout: number
}

class CommandProperties
    implements ICommandProperties
{
    action: string
    args: Array<string>
    kwargs: Map<string, string>
    timeout: number

    constructor(
        action: string,
        args?: Array<string>,
        kwargs?: Map<string, string>,
        timeout?: number
    ) {
        this.action = action
        this.args = args ? args : new Array<string>()
        this.kwargs = kwargs ? kwargs : new Map<string, string>()
        this.timeout = timeout ? timeout : 5000
    }
}

interface ICommandCall
    extends ICommandProperties
{
    process: any
    action: string
    args: Array<string>
    kwargs: Map<string, string>
    timeout: number
}

class CommandCall
    implements ICommandCall
{
    process: any
    action: string
    args: Array<string>
    kwargs: Map<string, string>
    timeout: number

    constructor({
        process,
        action,
        args,
        kwargs,
        timeout
    }: {
        process: any,
        action: string,
        args?: Array<string>,
        kwargs?: Map<string, string>,
        timeout?: number
    }) {
        this.process = process
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
    call: ICommandCall
    output?: ICommandResponse<any>

    execute(): ICommandResponse<any>
}

class Command {
    processId: string
    call: ICommandCall
    output: ICommandResponse<any>

    constructor(
        call: ICommandCall
    ) {
        this.processId = createRandomId()
        this.call = call
        this.output = {
            status: WorkStatus.PENDING,
            responseCode: ResponseCode.UNKNOWN,
            message: 'Command is pending'
        }
    }

    execute(): ICommandResponse<any> {
        let dataOutput: any;
        this.call.process(...this.call.args, this.call.kwargs).then( (data: any) => {
            dataOutput = data
        }).catch( (error: any) => {
            try{
                dataOutput = this.call.process
            }catch(e){
                dataOutput = error
            }
        });
        
        return {
            data: dataOutput,
            status: WorkStatus.COMPLETED,
            responseCode: ResponseCode.SUCCESS,
            message: `[${this.processId}] Command executed: ${this.call.action}`
        }
    }
}

export {
    ICommand,
    ICommandProperties,
    ICommandCall,
    ICommandResponse,
    Command,
    CommandCall,
    CommandProperties
}