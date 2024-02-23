import { Component, LogLevel, ResponseCode } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';
import { Libp2pOptions } from 'libp2p';
import { Node, NodeOptions } from './node.js';


class Manager {
    public nodes: Array<Node>;

    constructor() {
        this.nodes = new Array<Node>();
    }

    public async createNode({
        id,
        type,
        options
    }: {
        id?: string,
        type: Component,
        options?: NodeOptions
    }): Promise<Node> {
        const node = new Node({
            id,
            type,
            options
        });
        await node.init();
        this.addNode(node);
        return node;
    }

    private addNode(node: Node) {
        if (this.nodes.find((n: Node) => n.id === node.id)) {
            logger(
                {
                    level: LogLevel.WARN,
                    component: Component.SYSTEM,
                    message: `Node already exists: ${node.id}\n` +
                             `Node not added to manager`
                }
            )
            return;
        }
        this.nodes.push(node);
        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            code: ResponseCode.SUCCESS,
            message: `Node Added: ${node.id}`
        })
    }

    public getNode(id: string): Node | undefined {
        const node = this.nodes.find((node: Node) => node.id === id);
        if (node) {
            return node;
        }
        else {
            logger({
                level: LogLevel.WARN,
                component: Component.SYSTEM,
                code: ResponseCode.NOT_FOUND,
                message: `Node not found: ${id}`
            })
        }
    }

    public getNodesByType(type: Component): Array<Node> {
        return this.nodes.filter((node: Node) => node.type === type);
    }


    public getAllNodes(): Array<Node> {
        logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                code: ResponseCode.SUCCESS,
                message: `Getting all nodes`
        })
        return this.nodes;
    }

    public async closeNode(id: string): Promise<void> {
        const node = this.getNode(id);

        if (node && node.process) {
            try {
                await node.stop();
                // remove the node from the array
                this.nodes.slice(this.nodes.indexOf(node), 1);
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    component: Component.SYSTEM,
                    code: ResponseCode.FAILURE,
                    message: `Error closing node: ${node.id}, ${error}`
                })
            }
        }
    }

    public async closeAllNodes(): Promise<void> {
        this.nodes.forEach(async (node: Node) => {
            logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                code: ResponseCode.SUCCESS,
                message: `Closing node: ${node.id}`
            
            })
            if (node.type === Component.ORBITDB) {
                try {
                    await node.process.stop();
                }
                catch (error) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.SYSTEM,
                        code: ResponseCode.FAILURE,
                        message: `Error closing OrbitDB node: ${node.id}, ${error}`
                    })
                }
                await this.closeNode(node.id);
            }
        });
    }
}


export {
    Manager
}