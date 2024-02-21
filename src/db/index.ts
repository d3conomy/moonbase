import { Component, LogLevel } from '../utils/constants.js';
import { createNodeId, createRandomId } from '../utils/id.js';
import { logger } from '../utils/logBook.js';
import {
    Manager
} from './manager.js';
import { OpenDbOptions, openDb } from './openDb.js';
import { IPFSOptions } from './setupIPFS.js';
import { OrbitDbOptions } from './setupOrbitDb.js';
import { Database } from '@orbitdb/core';


class Db {
    public manager: Manager;
    public opened: Map<string, typeof Database>;

    constructor() {
        this.manager = new Manager();
        this.opened = new Map<string, typeof Database>();
    }

    public async init(): Promise<void> {
        // Create a libp2p node
        const type = Component.LIBP2P;
        const libp2pId = createNodeId(type);
        const libp2p = await this.manager.createNode({
            id: libp2pId,
            type: type
        });
        logger({
            level: LogLevel.INFO,
            message: 'Libp2p node created'
        });

        // Create an IPFS node
        const libp2p2 = this.manager.getNode(libp2pId);
        if (!libp2p2) {
            logger({
                level: LogLevel.ERROR,
                message: 'No libp2p node available'
            });
            return;
        }

        logger({
            level: LogLevel.INFO,
            message: `Libp2p node created: ${libp2p2.process.peerId.toString()}`
        });

        const ipfsId = createNodeId(Component.IPFS);
        const ipfsOptions = new IPFSOptions({
            libp2p: libp2p2.process
        });
        const ipfs = await this.manager.createNode({
            id: ipfsId,
            type: Component.IPFS,
            options: ipfsOptions
        });

        logger({
            level: LogLevel.INFO,
            message: 'IPFS node created'
        });

        try {
            const cid = ipfs.process.libp2p.peerId.toString();
            logger({
                level: LogLevel.INFO,
                message: `IPFS node created: ${cid}`
            });
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                message: `Error adding to IPFS: ${error}`
            });
        }

        // Create an OrbitDB node
        // const ipfs = this.manager.getNode(ipfsId);
        // console.log('ipfs', ipfs?.process.libp2p.peerId.toString())
        const orbitDbId = createNodeId(Component.ORBITDB);
        const orbitDbOptions = new OrbitDbOptions({
            ipfs: ipfs.process,
            enableDID: true
        });
        try {
            logger({
                level: LogLevel.INFO,
                message: 'Creating OrbitDB node...'
            });
            const orbitDb = await this.manager.createNode({
                id: orbitDbId,
                type: Component.ORBITDB,
                options: orbitDbOptions
            });
            logger({
                level: LogLevel.INFO,
                message: 'OrbitDB node creation process done...'
            });
            // const db = await orbitDb.process.open('orbitDbNode')
    
            // logger({
            //     level: LogLevel.INFO,
            //     message: `Database opened: ${await db.getMultiaddrs()}`
            // });
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                message: `Error creating OrbitDB node: ${error}`
            });
            return;
        }
        

        
    }

    public async open({
        id,
        orbitDb,
        databaseName,
        databaseType
    }: OpenDbOptions): Promise<{
        database: typeof Database
    } | undefined> {


        orbitDb = orbitDb ? orbitDb : this.manager.getNodesByType(Component.ORBITDB)[0];

        if (!orbitDb) {
            logger({
                level: LogLevel.ERROR,
                message: 'No OrbitDB node available'
            });
            return;
        }

        logger({
            level: LogLevel.INFO,
            message: `Opening db using OrbitDB node: ${orbitDb}\n` +
                `Database name: ${databaseName}, type: ${databaseType}\n` +
                `${orbitDb.process}`
        });

        try {
            const openDbOptions = new OpenDbOptions({
                id: id,
                orbitDb: orbitDb.process,
                databaseName: databaseName,
                databaseType: databaseType
            });
            const db = await openDb(openDbOptions);
            this.opened.set(id, db.database);
            logger({
                level: LogLevel.INFO,
                message: `Database ${databaseName} opened, Address ${db.database.address.toString()}`
            });
            return { database: db.database };
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                message: `Error opening database: ${error}`
            });
        }
        // let db = await orbitDb.process.open(databaseName, { type: databaseType })
        // this.opened.set(id, db); 

        // const address = db.address.toString();

        // logger({
        //     level: LogLevel.INFO,
        //     message: `Database ${databaseName}} opened at address ${address}`
        // });
        // return db;
        // });
    }
}

export {
    Db
}