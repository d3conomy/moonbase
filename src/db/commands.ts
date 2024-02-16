import {
    OrbitDb
} from '@orbitdb/core';
import { Component, createCommandId } from '../utils/index.js';
import { ProcessTypes } from './node.js';

class Command {
    public nodeId: string;
    public id: string;
    public type: Component;
    public call: string;
    public kwargs?: Map<string, any>;
    public output?: any;

    constructor({
        nodeId,
        id,
        type,
        call,
        kwargs
    }: {
        nodeId: string,
        id?: string,
        type: Component,
        call: string,
        kwargs?: Map<string, any>
    }) {
        this.nodeId = nodeId;
        this.id = id ? id : createCommandId(nodeId);
        this.type = type;
        this.call = call;
        this.kwargs = kwargs ? kwargs : new Map<string, any>();
    }

    setOutput(output: any) {
        this.output = output;
    }
}


const runCommand = async (command: Command, process: ProcessTypes) => {
    const output = await process[command.call](...Array.from(command.kwargs?.values() ? Array.from(command.kwargs.values()) : []));
    command.setOutput(output);
}



export {
    Command,
    runCommand
}