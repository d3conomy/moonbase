import {
    OrbitDbOptions,
    defaultOrbitDbOptions,
    createOrbitDbNode
} from './setupOrbitDb.js';

import { 
    IPFSOptions,
    createIPFSNode
} from './setupIPFS.js';

import { 
    createLibp2pNode
} from './setupLibp2p.js';
import { Component, LogLevel, ResponseCode } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';
import { Libp2p, Libp2pOptions } from 'libp2p';
import { Database, OrbitDB } from '@orbitdb/core';
import { Helia } from 'helia';
import { OpenDbOptions } from './openDb.js';
import { createRandomId } from '../utils/id.js';

type NodeOptions = OrbitDbOptions | IPFSOptions | Libp2pOptions;
type NodeTypes = typeof OrbitDB | Helia | Libp2p;

class Manager {
    public nodes: Map<string, NodeTypes>;
    public openDbs: Map<string, typeof Database>;

    constructor() {
        this.nodes = new Map<string, any>();
        this.openDbs = new Map<string, typeof Database>();
    }

    private checkNodeOptions(
        nodeType: Component,
        options: NodeOptions
    ) {
        let verified: boolean = true;

        switch (nodeType) {
            case Component.ORBITDB:
                if (!(options instanceof OrbitDbOptions)) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.ORBITDB,
                        code: ResponseCode.FAILURE,
                        message: 'Invalid options for OrbitDB node'
                    })
                    verified = false;
                }
                break;
            case Component.IPFS:
                if (!(options instanceof IPFSOptions)) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.IPFS,
                        code: ResponseCode.FAILURE,
                        message: 'Invalid options for IPFS node'
                    })
                    verified = false;
                }
                break;
            case Component.LIBP2P:
                if (options instanceof IPFSOptions ||
                    options instanceof OrbitDbOptions) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.LIBP2P,
                        code: ResponseCode.FAILURE,
                        message: 'Invalid options for Libp2p node'
                    })
                    verified = false;
                }
                break;
            default:
                logger({
                    level: LogLevel.ERROR,
                    component: Component.SYSTEM,
                    code: ResponseCode.FAILURE,
                    message: 'Invalid node type'
                })
                verified = false;
        }
        return verified;
    }

    async createNode({
        id,
        nodeType,
        options
    }: {
        id?: string,
        nodeType: Component,
        options: NodeOptions
    }): Promise<void> {
        if (!id) {
            id = `${nodeType}-${createRandomId()}`;
        }

        const verified: boolean = this.checkNodeOptions(nodeType, options);

        if (!verified) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.FAILURE,
                message: 'Invalid node options, Node creation failed'
            })
            return
        }
        let node: any;
        switch (nodeType) {
            case Component.ORBITDB:
                node = await createOrbitDbNode(options as OrbitDbOptions);
                break;
            case Component.IPFS:
                node = await createIPFSNode(options as IPFSOptions);
                break;
            case Component.LIBP2P:
                node = await createLibp2pNode(options as Libp2pOptions);
                break;
            default:
                throw new Error('Invalid node type');
        }
        this.nodes.set(id, node);
        logger({
            level: LogLevel.INFO,
            component: nodeType,
            code: ResponseCode.SUCCESS,
            message: `Node created: ${id}`
        
        })
    }

    public getNode(id: string): NodeTypes {
        logger(
            {
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                code: ResponseCode.SUCCESS,
                message: `Getting node: ${id}`
            }
        )
        return this.nodes.get(id);
    }

    public getAllNodes(): Map<string, NodeTypes> {
        logger(
            {
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                code: ResponseCode.SUCCESS,
                message: `Getting all nodes`
            }
        )
        return this.nodes;
    }

    public async closeNode(id: string) {
        const node = this.nodes.get(id);
        if (node) {
            await node.stop();
            this.nodes.delete(id);
        }
    }


    public async openDb({
        id,
        orbitDb,
        dbName,
        dbType
    }: OpenDbOptions) {
        const db = await orbitDb.open(dbName, { type: dbType });
        this.openDbs.set(id, db);
    }
}

export {
    Manager,
    NodeOptions,
    NodeTypes
}