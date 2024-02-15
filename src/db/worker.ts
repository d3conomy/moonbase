import {
    Libp2p,
    Libp2pOptions,
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
    IWorkerProcess,
    Libp2pWorkerProcess
} from './workerSetupLibp2p.js';

import {
    IWorkerOptions,
    WorkerOptions, 
    WorkerProcessOptions,
    ILibp2pWorkerOptions
} from './workerOptions.js';
import { libp2pCommands } from './workerSetupLibp2p.js';



type WorkerProcessTypes = Libp2p | Helia | typeof OrbitDb | typeof Database

interface IWorker {
    type: Component
    workerId?: string
    process?: IWorkerProcess
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
    process?: IWorkerProcess
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
        // this.process = process
        
        if (this.processOptions && process) {
            logger({
                level: LogLevel.WARN,
                workerId: this.workerId,
                message: `Worker cannot have both process and processOptions.\n` +
                         `The Process will be used and the options discarded.`
            })
            this.processOptions = undefined
            this.process = process

        }

        if (!this.processOptions && !process) {
            this.processOptions = new WorkerOptions({
                type: this.type,
                workerId: this.workerId
            }).processOptions
        }

        if (this.processOptions && !process) {
            // const { process, commands, executor } = await this.create(this.processOptions);
            this.create(this.processOptions).then((result) => {
                logger({
                    level: LogLevel.INFO,
                    workerId: this.workerId,
                    message: `Worker created.\n` +
                        `Type: ${this.type}\n` +
                        `WorkerId: ${this.workerId}\n` +
                        `Process: ${this.process}\n` +
                        `Commands: ${this.commands}\n`
                        // `Executor: ${this.processExecutor}`
                });
                this.process = result;
                // this.commands = result.commands;
                // this.processExecutor = result.executor;
            });
            // this.process = process;
            // this.commands = commands;
            // this.processExecutor = executor;
        }
        logger({
            level: LogLevel.INFO,
            workerId: this.workerId,
            message: `Worker created.\n` +
                `Type: ${this.type}\n` +
                `WorkerId: ${this.workerId}\n` +
                `Process: ${this.process}`
        });

        this.history = new Array<ICommand>()
    }

    private async create(
        processOptions: WorkerProcessOptions
    // ): Promise<{
    //     process: WorkerProcess,
    //     commands: Array<ICommandProperties>
    //     executor: any
    // }> {
     ): Promise<IWorkerProcess | undefined> { 
        let process: IWorkerProcess | undefined = undefined;
        let commands: Array<ICommandProperties> = new Array<ICommandProperties>();


        switch (this.type) {
            case Component.LIBP2P:
                processOptions = processOptions as ILibp2pWorkerOptions;
                process = new Libp2pWorkerProcess({processOptions});

                try {
                    await process.create()
                }
                catch (error) {
                    logger({
                        level: LogLevel.ERROR,
                        workerId: this.workerId,
                        message: `Error creating libp2p process: ${error}`
                    });
                }
                

                // try {
                //     const libp2p = await createLibp2p(processOptions.libp2pOptions as Libp2pOptions);
                //     logger({
                //         level: LogLevel.INFO,
                //         workerId: this.workerId,
                //         message: `Libp2p process created.\n` +
                //             `WorkerId: ${this.workerId}\n` +
                //             `PeerId: ${libp2p.peerId.toString()}\n` +
                //             `Process: ${libp2p}\n`
                //     });
                //     this.process = libp2p as Libp2p;
                //     this.commands = libp2pCommands();
                //     this.processExecutor = executeLibp2pCommand;
                // } catch (error) {
                //     logger({
                //         level: LogLevel.ERROR,
                //         workerId: this.workerId,
                //         message: `Error creating libp2p process: ${error}`
                //     });
                // }
                // break;
            // other cases
        }
        return process;

        // return {
        //     process,
        //     commands,
        //     executor
        // };
    }
        // switch (this.type) {
        //     case Component.LIBP2P:
        //         processOptions = processOptions as ILibp2pWorkerOptions
        //         createLibp2p(processOptions.libp2pOptions as Libp2pOptions).then((libp2p: Libp2p) => {
        //             logger({
        //                 level: LogLevel.INFO,
        //                 workerId: this.workerId,
        //                 message: `Libp2p process created.\n` +
        //                         `WorkerId: ${this.workerId}\n` +
        //                         `PeerId: ${libp2p.peerId.toString()}\n`
        //             });
        //             process = libp2p;
        //         }).catch((error: any) => {
        //             logger({
        //                 level: LogLevel.ERROR,
        //                 workerId: this.workerId,
        //                 message: `Error creating libp2p process: ${error}`
        //             });
        //         });
        //         console.log(process)
        //         commands = libp2pCommands();
        //         executor = executeLibp2pCommand;
        //         break;
        //     // case Component.IPFS:
        //     //     process = createHelia(processOptions)
        //     //     break
        //     // case Component.ORBITDB:
        //     //     process = createOrbitDb(processOptions)
        //     //     break
        //     // case Component.DATABASE:
        //     //     process = createOrbitDb(processOptions)
        //     //     break
        //     default:
        //         logger({
        //             level: LogLevel.ERROR,
        //             workerId: this.workerId,
        //             message: `Worker type not recognized.`
        //         })
        //         break
        // }
        // return {
        //     process,
        //     commands,
        //     executor
        // }
    // }

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
            this.process.execute({
                    action,
                    args,
                    kwargs,
                    timeout
            }).then((result: any) => {
                response.output = result
                this.history.push(response)
                logger({
                    level: LogLevel.INFO,
                    workerId: this.workerId,
                    message: `Command executed.\n` +
                        `WorkerId: ${this.workerId}\n` +
                        `ProcessId: ${response.processId}\n` +
                        `Action: ${action}\n` +
                        `Args: ${args}\n` +
                        `Kwargs: ${kwargs}\n` +
                        `Timeout: ${timeout}\n` +
                        `Output: ${result}`
                
                })
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
        // if (!this.process) {
        //     response.output = {
        //         status: WorkStatus.ERROR,
        //         responseCode: ResponseCode.NOT_FOUND,
        //         message: `Worker process not found.`
        //     }
        //     this.history.push(response)
        //     return response
        // }
        // if (!this.commands.find((c) => c.action === action)) {
        //     response.output = {
        //         status: WorkStatus.ERROR,
        //         responseCode: ResponseCode.NOT_FOUND,
        //         message: `Command not found.`
        //     }
        //     this.history.push(response)
        //     return response
        // }
        // try {
        //     this.processExecutor(
        //         response.processId,
        //         this.process,
        //         {
        //             action,
        //             args,
        //             kwargs,
        //             timeout
        //         },
        //         this.workerId
        //     ).then((result: any) => {
        //         response.output = result
        //         this.history.push(response)
        //         logger({
        //             level: LogLevel.INFO,
        //             workerId: this.workerId,
        //             message: `Command executed.\n` +
        //                 `WorkerId: ${this.workerId}\n` +
        //                 `ProcessId: ${response.processId}\n` +
        //                 `Action: ${action}\n` +
        //                 `Args: ${args}\n` +
        //                 `Kwargs: ${kwargs}\n` +
        //                 `Timeout: ${timeout}\n` +
        //                 `Output: ${result}`
                
        //         })
        //     });
        // } catch (error) {
        //     response.output = {
        //         status: WorkStatus.ERROR,
        //         responseCode: ResponseCode.INTERNAL_SERVER_ERROR,
        //         message: `Error executing command: ${error}`
        //     }
        //     this.history.push(response)
        // }
        // return response
    // }
// }


export {
    Worker,
    IWorker,
    WorkerProcessTypes
}