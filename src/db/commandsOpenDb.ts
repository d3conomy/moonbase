import { LogLevel, logger } from "../utils/index.js";
import { Command, INodeCommands } from "./commands.js";
import { Node, ProcessTypes } from "./node.js";

import {Database} from '@orbitdb/core';

class OpenDbCommands
    implements INodeCommands
{
    public process: typeof Database;
    public available: Array<Command>;

    constructor(process: ProcessTypes) {
        this.process = process;
        this.available = new Array<Command>();
    }

    public async execute(command: Command): Promise<Command> {
        logger({
            level: LogLevel.INFO,
            message: `OpenDbCommands: ${command.action}`
        });

        let response: any;

        switch (command.action) {
            case 'add':
                response = await this.process.add(command.kwargs?.get('value'));
            case 'put':
                response = await this.process.put(command.kwargs?.get('key'), command.kwargs?.get('value'));
            case 'get':
                response = await this.process.get(command.kwargs?.get('key'));
            case 'del':
                response = await this.process.del(command.kwargs?.get('key'));
            case 'all':
                response = await this.process.all();
                break;
            case 'close':
                response = await this.process.close();
            default:
                response = null;
        }
        command.setOutput(response);
        return command
    }

}

export {
    OpenDbCommands
}