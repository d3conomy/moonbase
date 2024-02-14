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
    createWorkerId
} from '../utils';



type WorkerProcess = Libp2p | Helia | typeof OrbitDb | typeof Database

interface IWorker {
    type: Component
    workerId?: string
    process: WorkerProcess
    commands: Array<ICommandCall>
    history: Array<ICommand>
}

class Worker
    implements IWorker
{
    type: Component
    workerId: string
    process: WorkerProcess
    commands: Array<ICommandCall>
    history: Array<ICommand>

    constructor(
        type: Component,
        process?: WorkerProcess,
        id?: string,
        commands?: Array<ICommandCall>,
    ) {
        this.type = type
        this.workerId = id ? id : createWorkerId(type)
        this.process = process
        this.commands = new Array<ICommandCall>()
        this.history = new Array<ICommand>()
    }
}


export {
    Worker,
    IWorker,
    WorkerProcess
}