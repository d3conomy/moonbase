import { LogLevel } from '../utils/constants.js';
import { createDbId, createRandomId } from '../utils/id.js';
import { logger } from '../utils/logBook.js';
import { Node } from './node.js';

import {
    OrbitDb,
    Database
} from '@orbitdb/core';

enum OrbitDbTypes {
    EVENTS = 'events',
    DOCUMENTS = 'documents',
    KEYVALUE = 'keyvalue',
    KEYVALUEINDEXED = 'keyvalueindexed'
}

class OpenDbOptions {
    public id: string;
    public orbitDb?: typeof OrbitDb;
    public databaseName: string;
    public databaseType: OrbitDbTypes;

    constructor({
        orbitDb,
        id,
        databaseName,
        databaseType
    }: {
        orbitDb: Node,
        id?: string,
        databaseName?: string,
        databaseType?: OrbitDbTypes
    }) {
        this.orbitDb = orbitDb;
        this.databaseName = databaseName ? databaseName : createRandomId()
        this.databaseType = databaseType ? databaseType : OrbitDbTypes.EVENTS;
        this.id = id ? id : `${createDbId(this.databaseType, this.databaseName)}`
    }
}

const openDb = async ({
    orbitDb,
    databaseName,
    databaseType
}: OpenDbOptions): Promise<typeof Database> => {
    let database: typeof Database;
    logger({
        level: LogLevel.INFO,
        message: `Opening database: ${databaseName}\n` +
                    `Type: ${databaseType}\n` +
                    `process: ${orbitDb.id}`

    });
    try {
        database = await orbitDb.process.open(databaseName, {
            type: databaseType
        });
        logger({
            level: LogLevel.INFO,
            message: `Database ${databaseName} opened`
        });
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            message: `Error opening database: ${error}`
        });
    }
    return database;

}




export {
    OrbitDbTypes,
    OpenDbOptions,
    openDb
}

