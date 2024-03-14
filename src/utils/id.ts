import { v4 as uuidv4 } from 'uuid';
// import * as randomWords from 'random-words';
import chance from 'chance';

import { Component, IdReferenceType, LogLevel, isIdReferenceType } from "./constants.js";
import { nameType as configNameType } from '../index.js';


/**
 * @function createRandomId
 * @returns {string} - A random id
 * @param overrideNameType - The type of name to generate
 * @summary '''Generates a random id'''
 * @description '''Generates a random id'''
 * @example    const id = createRandomId("names")
 *             console.log(id) // "johnny-zebra"
 */
const createRandomId = (overrideNameType?: string): string => {
    let nameType = configNameType;
    if (overrideNameType) {
        try {
            nameType = isIdReferenceType(overrideNameType);
        } catch (e) {
            nameType = configNameType;
        }
    }

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
 * @class IdReference
 * @property name - The name of the id reference
 * @property component - The component of the id reference
 * @method getId - Get the id reference
 * @method randomId - Get a random id
 * @summary '''Id reference class'''
 * @description '''Id reference class'''
 */
class IdReference {
    public name: string;
    public component: Component;

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
        if (id) {
            this.name = id;
        }
        else {
            this.name = IdReference.randomId(type);
        }
    }

    /**
     * @function getId
     * @param component - Whether to include the component in the id
     * @returns {string} - The id reference
     * @summary '''Get the id reference'''
     * @description '''Get the id reference'''
     * @example    const id = new IdReference({ component: Component.POD })
     *             console.log(id.getId()) // "abcd-1234"
     *             console.log(id.getId(true)) // "pod-abcd-1234"
     */
    public getId(component: boolean = false): string {
        if (component) {
            return `${this.component}-${this.name}`;
        }
        return this.name;
        
    }

    /**
     * @function randomId
     * @returns {string} - A random id
     * @summary '''Get a random id'''
     * @description '''Get a random id'''
     * @example    const id = IdReference.randomId()
     *             console.log(id) // "abcd-1234"
     */
    public static randomId(type?: string): string {
        return createRandomId(type);
    }
}


export {
    createRandomId,
    IdReference
}

