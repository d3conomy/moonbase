import { Component } from "./constants";


const createRandomId = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


class IdReference {
    public name: string;
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
            this.name = id;
        }
        else {
            this.name = this.randomId();
        }
    }

    public getId(component: boolean = false): string {
        if (component) {
            return `${this.component}-${this.randomId()}`;
        }
        return this.name;
        
    }

    public randomId(): string {
        return createRandomId();
    }
}


export {
    createRandomId,
    IdReference
}

