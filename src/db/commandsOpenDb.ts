import { LogLevel, logger } from "../utils/index.js";
import { Command, INodeCommands } from "./commands.js";
import { Node, ProcessTypes } from "./node.js";

import OrbitDb from '@orbitdb/core';

class OpenDbCommands
    implements INodeCommands
{
    public process: typeof OrbitDb;
    public available: Array<Command>;

    constructor(process: ProcessTypes) {
        this.process = process;
        this.available = new Array<Command>();
    }

    async execute(command: Command): Promise<any> {
        logger({
            level: LogLevel.INFO,
            message: `OpenDbCommands: ${command.action}`
        });

        switch (command.action) {
            case 'open':
                return await this.process.open(command.kwargs);
            case 'add':
                return await this.process.add(command.kwargs?.get('value'));
            case 'put':
                return await this.process.put(command.kwargs?.get('key'), command.kwargs?.get('value'));
            case 'get':
                return await this.process.get(command.kwargs?.get('key'));
            case 'del':
                return await this.process.del(command.kwargs?.get('key'));
            case 'close':
                return await this.process.close();
            default:
                return null;
        }
    }
}

export {
    OpenDbCommands
}