import { Component, LogLevel } from '../utils/constants.js';
import { IdReference } from '../utils/id.js';
import { logger } from '../utils/logBook.js';


import {
    Database
} from '@orbitdb/core';
import { OrbitDbProcess } from './orbitDb.js';
import { _BaseProcess, _IBaseProcess, _Status } from './base.js';

enum OrbitDbTypes {
    EVENTS = 'events',
    DOCUMENTS = 'documents',
    KEYVALUE = 'keyvalue',
    KEYVALUEINDEXED = 'keyvalueindexed'
}

class _OpenDbOptions {
    public orbitDb: OrbitDbProcess;
    public databaseName: string;
    public databaseType: OrbitDbTypes;
    public options?: Map<string, string>;

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
 * @constant openDb
 * @param orbitDb - The OrbitDb node
 * @param databaseName - The name of the database to open
 * @param databaseType - The type of the database to open
 * @returns [typeof Database] The opened database
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

class OpenDb
    extends _BaseProcess
    implements _IBaseProcess
{
    public declare process?: typeof Database;
    public declare options?: _OpenDbOptions;

    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: typeof Database,
        options?: _OpenDbOptions
    }) {
        super({
            id: id,
            component: Component.DB,
            process: process,
            options: options as _OpenDbOptions
        
        });
    }

    public async init(): Promise<void> {
        if (this.process) {
            this.status = new _Status({
                message: `Database process already initialized`
            });
            return;
        }

        if (!this.options) {
            throw new Error(`No OpenDb options found`)
        }
        const process = await openDb(this.options);
        this.status = new _Status({
            message: `Database process initialized`
        });
        this.process = process;
    }

    public async stop(): Promise<void> {
        if (this.process) {
            await this.process.close();
            this.status = new _Status({
                message: `Database process closed`
            });
        }
    }

    public address(): string {
        return this.process?.address;
    }

    public async add(data: any): Promise<string> {
        return await this.process?.add(data);
    }

    public async all(): Promise<any> {
        return await this.process?.all();
    }

    public async get(hash: string): Promise<any> {
        return await this.process?.get(hash);
    }

    public async put(key: string, value: any): Promise<string> {
        return await this.process?.put(key, value);
    }

    public async putDoc(doc: any): Promise<string> {
        return await this.process?.put(doc);
    }

    public async del(key: string): Promise<void> {
        await this.process?.del(key);
    }

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

