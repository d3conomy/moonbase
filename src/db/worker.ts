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


type WorkerProcess = Libp2p | Helia | typeof OrbitDb | typeof Database

interface IWorker {
    workerId?: string
    process: WorkerProcess
    commands: Array<ICommandCall>
    history: Array<ICommand>
}

class Worker
    implements IWorker
{
    id: string
    process: WorkerProcess
    commands: Array<ICommandCall>
    history: Array<ICommand>

    constructor(
        process: WorkerProcess,
        id?: string
    ) {
        this.id = id ? id : process.constructor.name
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