/// <reference path="../../src/typings.d.ts" />
import { IdReference } from '../utils/id.js';
import { Database } from '@orbitdb/core';
import { OrbitDbProcess } from './orbitDb.js';
import { _BaseProcess, _IBaseProcess } from './base.js';
/**
 * The Types of OrbitDb databases.
 * @category Database
 */
declare enum OrbitDbTypes {
    EVENTS = "events",
    DOCUMENTS = "documents",
    KEYVALUE = "keyvalue",
    KEYVALUEINDEXED = "keyvalueindexed"
}
/**
 * The options for opening a database.
 * @category Database
 */
declare class _OpenDbOptions {
    orbitDb: OrbitDbProcess;
    databaseName: string;
    databaseType: OrbitDbTypes;
    options?: Map<string, string>;
    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({ orbitDb, databaseName, databaseType, options }: {
        orbitDb: OrbitDbProcess;
        databaseName?: string;
        databaseType?: OrbitDbTypes | string;
        options?: Map<string, string>;
    });
}
/**
 * Opens a database.
 * @category Database
 */
declare const openDb: ({ orbitDb, databaseName, databaseType, options }: _OpenDbOptions) => Promise<typeof Database>;
/**
 * Represents a class for opening a database.
 * @category Database
 */
declare class OpenDb extends _BaseProcess implements _IBaseProcess {
    process?: typeof Database;
    options?: _OpenDbOptions;
    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({ id, process, options }: {
        id?: IdReference;
        process?: typeof Database;
        options?: _OpenDbOptions;
    });
    /**
     * Initializes the database process.
     */
    init(): Promise<void>;
    /**
     * Stops the database process.
     */
    stop(): Promise<void>;
    /**
     * Gets the address of the database process.
     */
    address(): string;
    /**
     * Adds data to the database.
     */
    add(data: any): Promise<string>;
    /**
     * Retrieves all data from the database.
     */
    all(): Promise<any>;
    /**
     * Retrieves data from the database based on the given hash.
     */
    get(hash: string): Promise<any>;
    /**
     * Puts data into the database with the given key and value.
     */
    put(key: string, value: any): Promise<string>;
    /**
     * Puts a document into the database.
     */
    putDoc(doc: any): Promise<string>;
    /**
     * Deletes data from the database based on the given key.
     */
    del(key: string): Promise<void>;
    /**
     * Queries the database using the given mapper function.
     */
    query(mapper: any): Promise<any>;
}
export { OrbitDbTypes, _OpenDbOptions, openDb, OpenDb };
//# sourceMappingURL=open.d.ts.map