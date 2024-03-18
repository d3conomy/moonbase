import { Component } from "./constants.js";
/**
 * Generates a random id
 * @category Utils
 * @example
 * const id = createRandomId("names")
 * console.log(id) // "johnny-zebra"
 */
declare const createRandomId: (overrideNameType?: string) => string;
/**
 * Id reference class
 * @category Utils
 */
declare class IdReference {
    name: string;
    component: Component;
    nameType: string;
    constructor({ component, id, type }: {
        component: Component;
        id?: string;
        type?: string;
    });
    /**
     * Get the id reference
     */
    getId(component?: boolean): string;
    /**
     * Create a random Id reference
     */
    static randomId(type?: string): string;
    /**
     * Create a new Id reference object
     */
    newId({ component, id, type }: {
        component: Component;
        id?: string;
        type?: string;
    }): IdReference;
}
export { createRandomId, IdReference };
//# sourceMappingURL=id.d.ts.map