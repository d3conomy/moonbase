import { OrbitDbOptions } from "../db/setupOrbitDb";
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


export {
    createRandomId,
    createNodeId,
    createCommandId,
    createDbId
}

