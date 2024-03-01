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
        const libp2p: Node = await this.createLibp2pNode({});
        const ipfs: Node = await this.createIPFSNode({
            libp2pNode: libp2p
        });
        const orbitDb: Node | undefined = await this.createOrbitDbNode({
            ipfsNode: ipfs
        });

        logger({
            level: LogLevel.INFO,
            message: `Db initialized ${orbitDb?.id}`
        });
    }

    public async createLibp2pNode({
        libp2pNodeId
    } : {
        libp2pNodeId?: Node['id']
    }): Promise<Node> {
        // Create a libp2p node
        const type = Component.LIBP2P;
        const libp2pId = libp2pNodeId ? libp2pNodeId : createNodeId(type);
        return await this.manager.createNode({
            id: libp2pId,
            type: type
        });
    }


    public async createIPFSNode({
        libp2pNode,
        libp2pNodeId,
        ipfsNodeId
    }: {
        libp2pNode?: Node,
        libp2pNodeId?: Node['id'],
        ipfsNodeId?: Node['id']
    }): Promise<Node> {
        let ipfsOptions: IPFSOptions;
        // get the libp2p node
        if (!libp2pNode && libp2pNodeId) {
            libp2pNode = this.manager.getNode(libp2pNodeId);

            if (!libp2pNode) {
                libp2pNode = await this.createLibp2pNode({libp2pNodeId: libp2pNodeId});
            }
        }
        else if (libp2pNode && libp2pNodeId) {
            logger({
                level: LogLevel.ERROR,
                message: 'Specify either libp2pNode or libp2pNodeId, not both.'
            });
        }
        else if (!libp2pNode && !libp2pNodeId) {
            libp2pNode = await this.createLibp2pNode({});
            ipfsNodeId = ipfsNodeId ? ipfsNodeId : `${Component.IPFS}-${libp2pNode.id}`;
            ipfsOptions = new IPFSOptions({
                libp2p: libp2pNode?.process,
            });
        }
        else {
            logger({
                level: LogLevel.ERROR,
                message: 'Invalid libp2p node'
            });
        }

        ipfsOptions = new IPFSOptions({
            libp2p: libp2pNode?.process
        });

        return await this.manager.createNode({
            id: ipfsNodeId,
            type: Component.IPFS,
            options: ipfsOptions
        });
    }

    public async createOrbitDbNode({
        ipfsNode,
        ipfsNodeId,
        orbitDbNodeId
    }: {
        ipfsNode?: Node,
        ipfsNodeId?: Node['id'],
        orbitDbNodeId?: Node['id']
    }): Promise<Node | undefined> {
        const orbitDbId: string = orbitDbNodeId ? orbitDbNodeId : createNodeId(Component.ORBITDB);
        // check if ipfs node is available
        if (!ipfsNode && ipfsNodeId) {
            ipfsNode = this.manager.getNode(ipfsNodeId);

            if (!ipfsNode) {
                ipfsNode = await this.createIPFSNode({ipfsNodeId})
            }
        }
        else if (!ipfsNode && !ipfsNodeId) {
            ipfsNodeId = `${Component.IPFS}-${orbitDbId}`;
            ipfsNode = await this.createIPFSNode({ipfsNodeId});
        }
        else if (ipfsNode && ipfsNodeId) {
            logger({
                level: LogLevel.ERROR,
                message: 'Specify either ipfsNode or ipfsNodeId, not both.'
            });
        }
        else {
            logger({
                level: LogLevel.ERROR,
                message: 'Invalid IPFS node'
            });
        }

        if (ipfsNode === null || ipfsNode === undefined) {
            logger({
                level: LogLevel.ERROR,
                message: 'No IPFS node available'
            });
            return
        }


        // Create an OrbitDB node
        const orbitDbOptions = new OrbitDbOptions({
            ipfs: ipfsNode,
            enableDID: true
        });

        logger({
            level: LogLevel.INFO,
            message: 'Creating OrbitDB node...'
        });
        return await this.manager.createNode({
            id: orbitDbId,
            type: Component.ORBITDB,
            options: orbitDbOptions
        });       
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

// const db = new Db()
// await db.init();

export {
    Db,
    // db
}