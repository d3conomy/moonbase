import { Component, LogLevel } from '../utils/constants.js';
import { IdReference } from '../utils/id.js';
import { logger } from '../utils/logBook.js';


import {
    Database
} from '@orbitdb/core';
import { OrbitDbProcess } from './orbitDb.js';
import { _BaseProcess, _IBaseProcess } from './base.js';

/**
 * The Types of OrbitDb databases.
 */
enum OrbitDbTypes {
    EVENTS = 'events',
    DOCUMENTS = 'documents',
    KEYVALUE = 'keyvalue',
    KEYVALUEINDEXED = 'keyvalueindexed'
}

/**
 * The options for opening a database.
 */
class _OpenDbOptions {
    public orbitDb: OrbitDbProcess;
    public databaseName: string;
    public databaseType: OrbitDbTypes;
    public options?: Map<string, string>;

    /**
     * Constructs a new instance of the _OpenDbOptions class.
     */
    constructor({
        orbitDb,
        databaseName,
        databaseType,
        options
    }: {
        orbitDb: OrbitDbProcess,
        databaseName?: string,
        databaseType?: OrbitDbTypes | string,
        options?: Map<string, string>
    }) {
        this.orbitDb = orbitDb;
        this.databaseName = databaseName ? databaseName : new IdReference({ component: Component.DB }).getId();
        this.databaseType = databaseType ? databaseType as OrbitDbTypes : OrbitDbTypes.EVENTS;
        this.options = options ? options : new Map<string, string>();
    }
}

/**
 * Opens a database.
 */
const openDb = async ({
    orbitDb,
    databaseName,
    databaseType,
    options
}: _OpenDbOptions): Promise<typeof Database> => {
    logger({
        level: LogLevel.INFO,
        message: `Opening database: ${databaseName}\n` +
                    `Type: ${databaseType}\n` +
                    `process: ${orbitDb.id.getId()}`

    });
    try {
        return await orbitDb.open({
            databaseName,
            databaseType,
            options
        });
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            message: `Error opening database: ${error}`
        });
    }
}

/**
 * Represents a class for opening a database.
 */
class OpenDb extends _BaseProcess implements _IBaseProcess {
    public declare process?: typeof Database;
    public declare options?: _OpenDbOptions;

    /**
     * Constructs a new instance of the OpenDb class.
     */
    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference;
        process?: typeof Database;
        options?: _OpenDbOptions;
    }) {
        super({
            id: id,
            component: Component.DB,
            process: process,
            options: options as _OpenDbOptions
        });
    }

    /**
     * Initializes the database process.
     */
    public async init(): Promise<void> {
        if (this.checkProcess()) {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Database process already exists`
            });
            return;
        }

        if (this.options) {
            this.process = await openDb({
                orbitDb: this.options.orbitDb,
                databaseName: this.options.databaseName,
                databaseType: this.options.databaseType,
                options: this.options.options
            });
        } else {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No database options found`
            });
            throw new Error(`No database options found`);
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Database process created`
        });
    }

    /**
     * Stops the database process.
     */
    public async stop(): Promise<void> {
        if (this.checkProcess()) {
            await this.process?.close();
            logger({
                level: LogLevel.INFO,
                processId: this.id,
                message: `Database process stopped`
            });
        } else {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No database process found`
            });
            throw new Error(`No database process found`);
        }
    }

    /**
     * Gets the address of the database process.
     */
    public address(): string {
        return this.process?.address;
    }

    /**
     * Adds data to the database.
     */
    public async add(data: any): Promise<string> {
        return await this.process?.add(data);
    }

    /**
     * Retrieves all data from the database.
     */
    public async all(): Promise<any> {
        return await this.process?.all();
    }

    /**
     * Retrieves data from the database based on the given hash.
     */
    public async get(hash: string): Promise<any> {
        return await this.process?.get(hash);
    }

    /**
     * Puts data into the database with the given key and value.
     */
    public async put(key: string, value: any): Promise<string> {
        return await this.process?.put(key, value);
    }

    /**
     * Puts a document into the database.
     */
    public async putDoc(doc: any): Promise<string> {
        return await this.process?.put(doc);
    }

    /**
     * Deletes data from the database based on the given key.
     */
    public async del(key: string): Promise<void> {
        await this.process?.del(key);
    }

    /**
     * Queries the database using the given mapper function.
     */
    public async query(mapper: any): Promise<any> {
        return await this.process?.query(mapper);
    }
}



export {
    OrbitDbTypes,
    _OpenDbOptions,
    openDb,
    OpenDb
}

