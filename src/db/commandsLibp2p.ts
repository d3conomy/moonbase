import { Component, createCommandId } from '../utils/index.js';
import { Node, ProcessTypes } from './node.js';
import { INodeCommands, Command } from './commands.js';


class Libp2pCommands
    implements INodeCommands
{
    public process: ProcessTypes;
    public available: Array<Command>;

    constructor(process: ProcessTypes) {
        this.process = process;
        this.available = new Array<Command>();
    }

    async execute(command: Command): Promise<any> {
        switch (command.action) {
            case 'peerInfo':
                return await this.process.peerId;
            default:
                return null;
        }
    }
}






export {
    Libp2pCommands
}