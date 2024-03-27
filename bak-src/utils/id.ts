import { v4 as uuidv4 } from 'uuid';
import chance from 'chance';

import {
    Component,
    IdReferenceType,
    isIdReferenceType
} from "./constants.js";


/**
 * Generates a random id
 * @category Utils
 * @example    
 * const id = createRandomId("names")
 * console.log(id) // "johnny-zebra"
 */
const createRandomId = (overrideNameType?: string): string => {
    let nameType = isIdReferenceType(overrideNameType);

    switch (nameType) {
        case IdReferenceType.NAME:
            return chance().first().toLowerCase() + '-' + chance().word({capitalize: false, syllables: 3});
        case IdReferenceType.UUID:
            return uuidv4();
        case IdReferenceType.STRING:
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        default:
            return uuidv4();
    }
}

/**
 * Id reference class
 * @category Utils
 */
class IdReference {
    public name: string;
    public component: Component;
    public nameType: string;

    constructor({
        component,
        id,
        type
    }: {
        component: Component
        id?: string,
        type?: string
    }) {
        this.component = component;
        this.nameType = type ? isIdReferenceType(type) : IdReferenceType.UUID;
        if (id) {
            this.name = id;
        }
        else {
            this.name = IdReference.randomId(this.nameType);
        }
    }

    /**
     * Get the id reference
     */
    public getId(component: boolean = false): string {
        if (component) {
            return `${this.component}-${this.name}`;
        }
        return this.name;
        
    }

    /**
     * Create a random Id reference
     */
    public static randomId(type?: string): string {
        return createRandomId(type);
    }

    /**
     * Create a new Id reference object
     */
    public newId({
        component,
        id,
        type
    }: {
        component: Component
        id?: string,
        type?: string
    }): IdReference {
        type = type ? type : this.nameType;
        return new IdReference({
            component,
            id,
            type
        });
    }
}


export {
    createRandomId,
    IdReference
}

