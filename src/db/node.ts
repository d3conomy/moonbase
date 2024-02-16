
import { Component, LogLevel, ResponseCode, createNodeId, createRandomId, logger } from "../utils/index.js";
import { IPFSOptions, createIPFSProcess } from "./setupIPFS.js";
import { OrbitDbOptions, createOrbitDbProcess } from "./setupOrbitDb.js";
import { Helia } from "helia";
import { Libp2p, Libp2pOptions } from "libp2p";
import { Database, OrbitDB } from "@orbitdb/core";
import { createLibp2pProcess, defaultLibp2pOptions } from "./setupLibp2p.js";

type NodeOptions = OrbitDbOptions | IPFSOptions | Libp2pOptions;

type ProcessTypes = typeof OrbitDB | Helia | Libp2p;

class Node {
    public id: string;
    public type: Component;
    public process?: ProcessTypes;
    private options?: NodeOptions;

    constructor({
        type,
        id,
        options,
        process
    }: {
        type: Component,
        id?: string,
        options?: NodeOptions,
        process?: ProcessTypes
    }) {
        this.id = id ? id : createNodeId(type);
        this.type = type;

        if (process && !options) {
            this.process = process;
        }
        else if (options && !process) {
            this.options = options;
        }
        else if (options && process) {
            logger({
                level: LogLevel.WARN,
                component: Component.SYSTEM,
                message: `Node has both options and process.\n` +
                         `Defaulting to process.\n` +
                         `Node: ${this.id}`
            })
            this.process = process;
        }
        else {
            switch (this.type) {
                case Component.LIBP2P:
                    this.options = defaultLibp2pOptions;
                    break;
                default:
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.SYSTEM,
                        code: ResponseCode.FAILURE,
                        message: `Node not created: ${this.id}`
                    })
                    break;
            }
        }
    }

    public init() {
        if (this.process) {
            return
        }
        else {
            this.createProcess({
                options: this.options
            }).then(() => {
                while (!this.process) {
                    setTimeout(() => {
                        logger({
                            level: LogLevel.INFO,
                            component: Component.SYSTEM,
                            code: ResponseCode.SUCCESS,
                            message: `Process created: ${this.id}`
                        })
                    }, 1000);
                }
                logger({
                    level: LogLevel.INFO,
                    component: Component.SYSTEM,
                    code: ResponseCode.SUCCESS,
                    message: `Process created: ${this.id}`
                })
            });
        }
    }

    private verifyOptions(
        options?: NodeOptions
    ) {
        let verified: boolean = true;

        if (!options) {
            if (this.type === Component.LIBP2P) {
                options = defaultLibp2pOptions;
            }
            else {
                logger({
                    level: LogLevel.ERROR,
                    component: Component.SYSTEM,
                    code: ResponseCode.FAILURE,
                    message: 'Node options not provided'
                })
                verified = false;
            }
        }

        switch (this.type) {
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

    async createProcess({
        options
    }: {
        options?: NodeOptions
    }): Promise<void> {
        const verified: boolean = this.verifyOptions(options);
        let process: any;

        if (!verified) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.FAILURE,
                message: 'Invalid node options, Node creation failed'
            })
            return
        }

        if (this.process) {
            logger({
                level: LogLevel.WARN,
                component: Component.SYSTEM,
                code: ResponseCode.FAILURE,
                message: `Node already has a process: ${this.id}`
            })
            return
        }

        switch (this.type) {
            case Component.ORBITDB:
                process = await createOrbitDbProcess(options as OrbitDbOptions);
                break;
            case Component.IPFS:
                process = await createIPFSProcess(options as IPFSOptions);
                break;
            case Component.LIBP2P:
                process = await createLibp2pProcess(options ? options as Libp2pOptions : defaultLibp2pOptions);
                break;
            default:
                throw new Error('Invalid node type');
        }
        this.process = process;
    }
   
    public async stop() {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.FAILURE,
                message: `Node not found: ${this.id}`
            })
            return
        }
        
        switch (this.type) {
            case Component.ORBITDB:
                this.process.disconnect();
                break;
            case Component.IPFS:
                this.process.close();
                break;
            case Component.LIBP2P:
                this.process.stop();
                break;
            default:
                throw new Error('Invalid node type');
        }
    }

}

export {
    Node,
    NodeOptions,
    ProcessTypes
}
