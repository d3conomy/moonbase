import { Node, ProcessTypes } from './node.js';
import { INodeCommands, Command } from './commands.js';
import { LogLevel } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';


class Libp2pCommands
    implements INodeCommands
{
    public process: ProcessTypes;
    public available: Array<Command>;

    constructor(process: ProcessTypes) {
        this.process = process;
        this.available = new Array<Command>();
    }

    public async execute(command: Command): Promise<Command> {
        let response: any;
        switch (command.action) {
            case 'peerInfo':
                response = await this.process.peerId.toString();
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