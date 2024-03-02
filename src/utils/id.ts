import { Component } from "./constants";

const createRandomId = () => {
    return Math.random().toString(36).substring(2, 15);
}

const createNodeId = (type: Component) => {
    return `${type}-${createRandomId()}`;
}

const createCommandId = (nodeId: string, action: string) => {
    return `command-${action}-${nodeId}-${createRandomId()}`;
}

const createDbId = (dbType: string, dbName: string) => {
    return `${dbType}-${dbName}`;
}

class IdReference {
    public id: string;
    public component: Component;

    constructor({
        component,
        id,
    }: {
        component: Component
        id?: string,
    }) {
        this.component = component;
        if (id) {
            this.id = id;
        }
        else {
            this.id = this.randomId();
        }
    }

    public getId(): string {
        return this.id;
    }

    public randomId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}


export {
    createRandomId,
    createNodeId,
    createCommandId,
    createDbId,
    IdReference
}

