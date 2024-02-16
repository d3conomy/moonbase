import { Component, LogLevel } from '../utils/constants.js';
import { createNodeId, createRandomId } from '../utils/id.js';
import { logger } from '../utils/logBook.js';
import {
    Manager
} from './manager.js';
import { OpenDbOptions } from './openDb.js';
import { IPFSOptions } from './setupIPFS.js';
import { OrbitDbOptions } from './setupOrbitDb.js';
import { Database } from '@orbitdb/core';


class Db {
    public manager: Manager;
    public opened: Map<string, typeof Database>;

    constructor() {
        this.manager = new Manager();
        this.opened = new Map<string, typeof Database>();

        // this.init().then(() => {
        //     logger({
        //         level: LogLevel.INFO,
        //         message: 'Db initialized'
        //     });
        // });
    }

    public async init(): Promise<void> {
        // Create a libp2p node
        const type = Component.LIBP2P;
        const libp2pId = createNodeId(type);
        await this.manager.createNode({
            id: libp2pId,
            type: type
        });
        logger({
            level: LogLevel.INFO,
            message: 'Libp2p node created'
        });

        // //wait until the libp2p node is created
        // while (!this.manager.getNode(libp2pId)?.process) {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        // }

        // Create an IPFS node
        const libp2p = this.manager.getNode(libp2pId);
        const ipfsId = createNodeId(Component.IPFS);
        const ipfsOptions = new IPFSOptions({
            libp2p: libp2p?.process
        });
        await this.manager.createNode({
            id: ipfsId,
            type: Component.IPFS,
            options: ipfsOptions
        });

        // while (!this.manager.getNode(ipfsId)?.process) {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        // }

        logger({
            level: LogLevel.INFO,
            message: 'IPFS node created'
        });

        // Create an OrbitDB node
        const ipfs = this.manager.getNode(ipfsId);
        const orbitDbId = createNodeId(Component.ORBITDB);
        await this.manager.createNode({
            id: orbitDbId,
            type: Component.ORBITDB,
            options: new OrbitDbOptions({
                ipfs: ipfs?.process,
                enableDID: true
            })
        });

        // while (!this.manager.getNode(orbitDbId)?.process) {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        // }

        logger({
            level: LogLevel.INFO,
            message: 'OrbitDB node created'
        });
    }

    public async open({
        id,
        orbitDb,
        dbName,
        dbType
    }: OpenDbOptions): Promise<void> {


        orbitDb = orbitDb ? orbitDb : this.manager.getNodesByType(Component.ORBITDB)[0];


        const db = await orbitDb.process.open(dbName, { type: dbType });
        this.opened.set(id, db);
    }
}

export {
    Db
}