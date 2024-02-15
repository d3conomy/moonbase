import {
    Libp2p,
    createLibp2p
} from 'libp2p';

import {
    Helia,
    createHelia
} from 'helia';

import {
    createOrbitDb,
    OrbitDb,
    Database
} from '@orbitdb/core';

import {
    CommandProperties,
    ICommand,
    ICommandProperties
} from './command.js';

import {
    Component,
    LogLevel,
    ResponseCode,
    WorkStatus,
    createProcessId,
    createWorkerId,
    logger
} from '../utils/index.js';

import {
    createLibp2pProcess, executeLibp2pCommand
} from './workerSetupLibp2p.js';

import {
    IWorkerOptions,
    WorkerOptions, 
    WorkerProcessOptions,
    ILibp2pWorkerOptions
} from './workerOptions.js';
import { libp2pCommands } from './workerSetupLibp2p.js';



type WorkerProcess = Libp2p | Helia | typeof OrbitDb | typeof Database

interface IWorker {
    type: Component
    workerId?: string
    process?: WorkerProcess
    processOptions?: WorkerProcessOptions
    proessExecutor?: any
    commands: Array<ICommandProperties>
    history: Array<ICommand>
}

class Worker
    implements IWorker
{
    type: Component
    workerId: string
    process?: WorkerProcess
    processOptions? : WorkerProcessOptions
    processExecutor?: any
    commands: Array<ICommandProperties>
    history: Array<ICommand>

    constructor({
        type,
        workerId,
        process,
        processOptions,
        dependencies,
    }: WorkerOptions) {
        this.type = type
        this.workerId = workerId
        this.commands = new Array<ICommandProperties>()
        this.processOptions = processOptions
        this.process = process
        
        if (this.processOptions && this.process) {
            logger({
                level: LogLevel.WARN,
                workerId: this.workerId,
                message: `Worker cannot have both process and processOptions.` +
                         `The Process will be used and the options discarded.`
            })
            this.processOptions = undefined
            // this.process = process

        }

        if (!this.processOptions && !this.process) {
            this.processOptions = new WorkerOptions({
                type: this.type,
                workerId: this.workerId
            }).processOptions
        }

        if (this.processOptions && !this.process) {
            this.create(this.processOptions).then( ({process, commands, executor}) => {
                this.process = process
                this.commands = commands
                this.processExecutor = executor
            });
            // this.process = process
            // this.commands = commands
            // this.processExecutor = executor
        }
        logger({
            level: LogLevel.INFO,
            workerId: this.workerId,
            message: `Worker created.\n` +
                    `Type: ${this.type}\n` +
                    `WorkerId: ${this.workerId}` +
                    `Process: ${this.process}`
        
        })

        this.history = new Array<ICommand>()
    }

    private async create(
        processOptions: WorkerProcessOptions
    ): Promise<{
        process: WorkerProcess,
        commands: Array<ICommandProperties>
        executor: any
    }>{
        let process: WorkerProcess;
        let commands: Array<ICommandProperties> = new Array<ICommandProperties>();
        let executor: any = undefined;
        switch (this.type) {
            case Component.LIBP2P:
                process = await createLibp2pProcess(processOptions as ILibp2pWorkerOptions);
                console.log(process)
                commands = libp2pCommands();
                executor = executeLibp2pCommand;
                break
            // case Component.IPFS:
            //     process = createHelia(processOptions)
            //     break
            // case Component.ORBITDB:
            //     process = createOrbitDb(processOptions)
            //     break
            // case Component.DATABASE:
            //     process = createOrbitDb(processOptions)
            //     break
            default:
                logger({
                    level: LogLevel.ERROR,
                    workerId: this.workerId,
                    message: `Worker type not recognized.`
                })
                break
        }
        return {
            process,
            commands,
            executor
        }
    }

    public execute(
        action: string,
        args?: Array<string>,
        kwargs?: Map<string, string>,
        timeout?: number
    ): ICommand {
        let response: ICommand = {
            processId: createProcessId(
                this.type,
                this.workerId
            ),
            process: {
                action,
                args,
                kwargs,
                timeout
            }
        }
        if (!this.process) {
            response.output = {
                status: WorkStatus.ERROR,
                responseCode: ResponseCode.NOT_FOUND,
                message: `Worker process not found.`
            }
            this.history.push(response)
            return response
        }
        if (!this.commands.find((c) => c.action === action)) {
            response.output = {
                status: WorkStatus.ERROR,
                responseCode: ResponseCode.NOT_FOUND,
                message: `Command not found.`
            }
            this.history.push(response)
            return response
        }
        try {
            this.processExecutor(
                this.process,
                {
                    action,
                    args,
                    kwargs,
                    timeout
                },
                response.processId,
                this.workerId
            ).then((result: any) => {
                response.output = result
                this.history.push(response)
            });
        } catch (error) {
            response.output = {
                status: WorkStatus.ERROR,
                responseCode: ResponseCode.INTERNAL_SERVER_ERROR,
                message: `Error executing command: ${error}`
            }
            this.history.push(response)
        }
        return response
    }
}


export {
    Worker,
    IWorker,
    WorkerProcess
}