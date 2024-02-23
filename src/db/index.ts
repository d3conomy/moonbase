import { Component, LogLevel } from '../utils/constants.js';
import { createCommandId, createNodeId, createRandomId } from '../utils/id.js';
import { logger } from '../utils/logBook.js';
import { Command } from './commands.js';
import {
    Manager
} from './manager.js';
import { Node } from './node.js';
import { OpenDbOptions, OrbitDbTypes, openDb } from './openDb.js';
import { IPFSOptions } from './setupIPFS.js';
import { OrbitDbOptions } from './setupOrbitDb.js';
import { Database } from '@orbitdb/core';


class Db {
    public manager: Manager;
    // public opened: Map<string, Node>;

    constructor() {
        this.manager = new Manager();
        // this.opened = new Map<string, Node>();
    }

    public async init(): Promise<void> {
        // Create a libp2p node
        const type = Component.LIBP2P;
        const libp2pId = createNodeId(type);
        await this.manager.createNode({
            id: libp2pId,
            type: type
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
            ipfs: ipfs,
            enableDID: true
        });
        // try {
            logger({
                level: LogLevel.INFO,
                message: 'Creating OrbitDB node...'
            });
            await this.manager.createNode({
                id: orbitDbId,
                type: Component.ORBITDB,
                options: orbitDbOptions
            });
            logger({
                level: LogLevel.INFO,
                message: 'OrbitDB node creation process done...'
            });

        // }
        // catch (error) {
        //     logger({
        //         level: LogLevel.ERROR,
        //         message: `Error creating OrbitDB node: ${error}`
        //     });
        //     return;
        // }
        

        
    }

    public async open({
        id,
        orbitDb,
        databaseName,
        databaseType
    }: {
        id: string,
        orbitDb?: Node,
        databaseName: string,
        databaseType: OrbitDbTypes
    
    }): Promise<Node | undefined> {


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
            message: `Opening db using OrbitDB node: ${orbitDb.id}\n` +
                `Database name: ${databaseName}, type: ${databaseType}`
        });

        try {
            const openDbOptions = new OpenDbOptions({
                id: id,
                orbitDb: orbitDb,
                databaseName: databaseName,
                databaseType: databaseType
            });
            // const db = await openDb(openDbOptions);
            const node = await this.manager.createNode({
                id: id,
                type: Component.DB,
                options: openDbOptions
            });
            // this.opened.set(id, opened);
            logger({
                level: LogLevel.INFO,
                message: `Database opened ${databaseName}`
            });
            return node;
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                message: `Error opening database: ${error}`
            });
        }
    }

    public async executeCommand({
        id,
        nodeId,
        type,
        action,
        kwargs
    }: {
        id?: string,
        nodeId: string,
        type: Component,
        action: string,
        kwargs?: Map<string, any>
    }): Promise<Command> {
        let command = new Command({
            id: id ? id : createCommandId(nodeId, action),
            nodeId: nodeId,
            type: type,
            action: action,
            kwargs: kwargs
        });

        const node = this.manager.getNode(command.nodeId);
        if (!node) {
            logger({
                level: LogLevel.ERROR,
                message: `Node not found: ${command.nodeId}`
            });
            command.setOutput(`Node not found: ${command.nodeId}`);
        }
        else {
            command = await node.execute(command);

            // command.setOutput(response);
        }

        return command;
    }
}

export {
    Db
}