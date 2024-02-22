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

    public async execute(command: Command): Promise<any> {
        let response: any;
        switch (command.action) {
            case 'peerInfo':
                response = this.process.peerId.toString();
                break;
            default:
                return null;
        }
        command.setOutput(response);
        return command
    }
}


export {
    Libp2pCommands
}