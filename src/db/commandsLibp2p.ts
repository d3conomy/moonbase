import { Node, ProcessTypes } from './node.js';
import { INodeCommands, Command } from './commands.js';
import { LogLevel } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';
import { Libp2p } from 'libp2p';


class Libp2pCommands
    implements INodeCommands
{
    public process: Libp2p;
    public available: Array<Command>;

    constructor(process: Libp2p) {
        this.process = process;
        this.available = new Array<Command>();
    }

    public async execute(command: Command): Promise<Command> {
        let response: any;
        switch (command.action) {
            case 'peerInfo':
                response = this.process.peerId.toString();
                logger({
                    level: LogLevel.INFO,
                    message: `Libp2pCommands: ${command.action}, Response: ${response}`
                })
                break;
            case 'status':
                response = this.process.status;
                logger({
                    level: LogLevel.INFO,
                    message: `Libp2pCommands: ${command.action}, Response: ${response}`
                })
                break;
            case 'multiaddrs':
                response = this.process.getMultiaddrs();
                logger({
                    level: LogLevel.INFO,
                    message: `Libp2pCommands: ${command.action}, Response: ${response}`
                })
                break;
            default:
                return command;
        }
        command.setOutput(response);
        return command
    }
}


export {
    Libp2pCommands
}