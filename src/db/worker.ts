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
    ICommand,
    ICommandProperties,
    ICommandCall
} from './command.js';

import {
    Component,
    LogLevel,
    ResponseCode,
    createWorkerId,
    logger
} from '../utils/index.js';

import {
    createLibp2pProcess
} from './workerSetupLibp2p.js';

import {
    IWorkerOptions,
    WorkerOptions, 
    WorkerProcessOptions,
    ILibp2pWorkerOptions
} from './workerOptions.js';
import { libp2pCommands } from './commandsLibp2p.js';



type WorkerProcess = Libp2p | Helia | typeof OrbitDb | typeof Database

interface IWorker {
    type: Component
    workerId?: string
    process?: WorkerProcess
    processOptions?: WorkerProcessOptions
    commands: Array<ICommandCall>
    history: Array<ICommand>
}

class Worker
    implements IWorker
{
    type: Component
    workerId: string
    process?: WorkerProcess
    processOptions? : WorkerProcessOptions
    commands: Array<ICommandCall>
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
        this.commands = new Array<ICommandCall>()
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
            const { process, commands } = this.create(this.processOptions)
            this.process = process
            this.commands = commands
        }
        logger({
            level: LogLevel.INFO,
            workerId: this.workerId,
            message: `Worker created.`
        
        })

        this.history = new Array<ICommand>()
    }

    private create(
        processOptions: WorkerProcessOptions
    ): {
        process: WorkerProcess,
        commands: Array<ICommandCall>
    }{
        let process: WorkerProcess;
        let commands: Array<ICommandCall> = new Array<ICommandCall>();
        switch (this.type) {
            case Component.LIBP2P:
                process = createLibp2pProcess(processOptions as ILibp2pWorkerOptions)
                commands = libp2pCommands({
                    worker: process as Libp2p,
                });
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
            commands
        }
    }
}


export {
    Worker,
    IWorker,
    WorkerProcess
}