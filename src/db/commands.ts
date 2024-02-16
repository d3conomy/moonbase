import { Component, createCommandId } from '../utils/index.js';
import { Node, ProcessTypes } from './node.js';

class Command {
    public nodeId: string;
    public id: string;
    public type: Component;
    public action: string;
    public kwargs?: Map<string, any>;
    public output?: any;

    constructor({
        nodeId,
        id,
        type,
        action,
        kwargs
    }: {
        nodeId: string,
        id?: string,
        type: Component,
        action: string,
        kwargs?: Map<string, any>
    }) {
        this.nodeId = nodeId;
        this.id = id ? id : createCommandId(nodeId, action);
        this.type = type;
        this.action = action;
        this.kwargs = kwargs ? kwargs : new Map<string, any>();
    }

    setOutput(output: any) {
        this.output = output;
    }
}

interface INodeCommands {
    process: ProcessTypes;
    available: Array<Command>;

    execute(command: Command): Promise<any>;
}

export {
    Command,
    INodeCommands,
}