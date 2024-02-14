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
} from './command';

import {
    Component,
    LogLevel,
    ResponseCode,
    createWorkerId,
    logger
} from '../utils';
import { createLibp2pProcess } from './workerSetupLibp2p';
import { DefaultWorkerOptions, IWorkerOptions, WorkerOptions, WorkerProcessOptions, ILibp2pWorkerOptions } from './workerOptions';



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
        this.process = process
        this.processOptions = processOptions



        this.commands = new Array<ICommandCall>()
        this.history = new Array<ICommand>()
    }
}


export {
    Worker,
    IWorker,
    WorkerProcess
}