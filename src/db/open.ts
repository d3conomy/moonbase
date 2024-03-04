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

    constructor({
        orbitDb,
        databaseName,
        databaseType
    }: {
        orbitDb: OrbitDbProcess,
        databaseName?: string,
        databaseType?: OrbitDbTypes
    }) {
        this.orbitDb = orbitDb;
        this.databaseName = databaseName ? databaseName : new IdReference({ component: Component.DB }).getId();
        this.databaseType = databaseType ? databaseType : OrbitDbTypes.EVENTS;
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
    databaseType
}: _OpenDbOptions): Promise<typeof Database> => {
    logger({
        level: LogLevel.INFO,
        message: `Opening database: ${databaseName}\n` +
                    `Type: ${databaseType}\n` +
                    `process: ${orbitDb.id.getId()}`

    });
    try {
        return await orbitDb.process.open(databaseName, {
            type: databaseType
        });
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            message: `Error opening database: ${error}`
        });
    }
}

class OpendDb
    extends _BaseProcess
    implements _IBaseProcess
{
    public process?: typeof Database;
    public options?: _OpenDbOptions;

    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: typeof Database,
        options?: _OpenDbOptions
    }) {
        super({});
        this.id = id ? id : new IdReference({ component: Component.DB });
        this.process = process;
        this.options = options;
    }

    public async init(): Promise<void> {
        if (this.process) {
            this.status = new _Status({
                // stage: this.process.ipfs.libp2p.status,
                message: `Database process already initialized`
            });
            return;
        }

        if (!this.options) {
            this.options = new _OpenDbOptions({
                orbitDb: new OrbitDbProcess({})
            });
        }

        if (!this.process) {
            this.process = await openDb(this.options);
            this.status = new _Status({
                // stage: this.process.ipfs.libp2p.status,
                message: `Database process initialized`
            });
        }
    }
}



export {
    OrbitDbTypes,
    _OpenDbOptions,
    openDb,
    OpendDb
}

