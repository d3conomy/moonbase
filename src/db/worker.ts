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


type WorkerProcess = Libp2p | Helia | typeof OrbitDb | typeof Database

interface IWorker {
    id: string
    process: WorkerProcess

    
}