
import { Component, LogLevel, ResponseCode, createNodeId, createRandomId, logger } from "../utils/index.js";
import { IPFSOptions, createIPFSProcess } from "./setupIPFS.js";
import { OrbitDbOptions, createOrbitDbProcess } from "./setupOrbitDb.js";
import { Helia } from "helia";
import { Libp2p, Libp2pOptions } from "libp2p";
import { Database, OrbitDB } from "@orbitdb/core";
import { createLibp2pProcess, defaultLibp2pOptions } from "./setupLibp2p.js";
import { Command, INodeCommands} from "./commands.js";
import { Libp2pCommands } from "./commandsLibp2p.js";
import { OpenDbCommands } from "./commandsOpenDb.js";
import { OpenDbOptions, openDb } from "./openDb.js";

type NodeOptions = OrbitDbOptions | IPFSOptions | Libp2pOptions | OpenDbOptions;
type NodeCommands = Libp2pCommands | OpenDbCommands;
type ProcessTypes = typeof OrbitDB | Helia | Libp2p | typeof Database;

class Node {
    public id: string;
    public type: Component;
    public process?: ProcessTypes;
    public commands?: NodeCommands;
    private options?: NodeOptions;

    constructor({
        type,
        id,
        options,
        process,
        commands,
    }: {
        type: Component,
        id?: string,
        options?: NodeOptions,
        process?: ProcessTypes,
        commands?: NodeCommands
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
                    this.options = defaultLibp2pOptions();
                    break;
                case Component.DB:
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
        this.commands = commands;
    }

    public async init() {
        let message = `Node init...`;
        if (this.process) {
            return
        }

        await this.createProcess({
            options: this.options
        })

        switch (this.type) {
            case Component.LIBP2P:
                if (this.process) {
                    this.commands = new Libp2pCommands(this.process);
                }
                else {
                    message = `Node not created`
                }
                break;
            case Component.IPFS:
                if (this.process) {
                    // const ipfs = this.process;
                    // console.log(ipfs);
                }
                else {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.SYSTEM,
                        code: ResponseCode.FAILURE,
                        message: `Process not found. Node not created: ${this.id}`
                    })
                }
                break;
            case Component.DB:
                if (this.process) {
                    this.commands = new OpenDbCommands(this.process);
                }
                else {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.SYSTEM,
                        code: ResponseCode.FAILURE,
                        message: `Node not created: ${this.id}`
                    })
                }
                break;
            case Component.ORBITDB:
                while (!this.process) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                if (this.process) {

                }
                else {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.SYSTEM,
                        code: ResponseCode.FAILURE,
                        message: `Process not found. Node not created: ${this.id}`
                    })
                }
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
        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            code: ResponseCode.SUCCESS,
            workerId: this.id,
            message
        })
    }

    private verifyOptions(
        options?: NodeOptions
    ) {
        let verified: boolean = true;

        if (!options) {
            if (this.type === Component.LIBP2P) {
                options = defaultLibp2pOptions();
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
            case Component.DB:
                if (!(options instanceof OpenDbOptions)) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.ORBITDB,
                        code: ResponseCode.FAILURE,
                        message: 'Invalid options for OpenDb'
                    })
                    verified = false;
                }
                break;
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
                if (options instanceof IPFSOptions) {
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

    public async createProcess({
          options
    }: {
        options?: NodeOptions
    }): Promise<void> {
        const verified: boolean = this.verifyOptions(options);
        let process: any;
        let commands: any;

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
            case Component.DB:
                process = await openDb(options as OpenDbOptions);
                commands = new OpenDbCommands(process);
                break;
            case Component.ORBITDB:
                process = await createOrbitDbProcess(options as OrbitDbOptions);
                break;
            case Component.IPFS:
                process = await createIPFSProcess(options as IPFSOptions);
                break;
            case Component.LIBP2P:
                const newOptions = options ? options as Libp2pOptions : defaultLibp2pOptions();
                process = await createLibp2pProcess(newOptions);
                commands = new Libp2pCommands(process);
                break;
            default:
                throw new Error('Invalid node type');
        }
        this.process = process;
        this.commands = commands;

        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.FAILURE,
                message: `Process not created for node: ${this.id}`
            })
            return;
        }
        return;
    }

    public async execute(command: Command): Promise<Command> {

        await this.commands?.execute(command);

        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            code: ResponseCode.SUCCESS,
            message: `Command executed: ${command.id}, Output ${command.output}`
        })

        return command;
    }
   
    public async stop() {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.FAILURE,
                message: `Node process not found: ${this.id}`
            })
            return
        }
        
        switch (this.type) {
            case Component.DB:
                    await this.process.stop()
                    await this.process.close();

                break;
            case Component.ORBITDB:
                await this.process.stop();
                await this.process.ipfs.libp2p.stop();
                break;
            case Component.IPFS:
                await this.process.libp2p.stop();
                break;
            case Component.LIBP2P:
                await this.process.stop();
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
