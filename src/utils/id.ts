import { Component } from "./constants";

const createRandomId = () => {
    return Math.random().toString(36).substring(2, 15);
}

const createWorkerId = (type: Component) => {
    return `${type}-${createRandomId()}`;
}

const createProcessId = (type: Component, worker: string) => {
    return `${type}-${worker}-${createRandomId()}`;
}

export {
    createRandomId,
    createWorkerId,
    createProcessId
}

