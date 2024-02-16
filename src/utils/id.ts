import { OrbitDbOptions } from "../db/setupOrbitDb";
import { Component } from "./constants";

const createRandomId = () => {
    return Math.random().toString(36).substring(2, 15);
}

const createNodeId = (type: Component) => {
    return `${type}-${createRandomId()}`;
}

const createProcessId = (type: Component, worker: string) => {
    return `${type}-${worker}-${createRandomId()}`;
}


export {
    createRandomId,
    createNodeId,
    createProcessId
}

