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
    public orbitDb: Node;
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
}: OpenDbOptions): Promise<{database: typeof Database}> => {
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

    logger({
        level: LogLevel.INFO,
        message: `Database address: ${database?.address.toString()}`
    });

    logger({
        level: LogLevel.INFO,
        message: `IPFS status: ${orbitDb.process.ipfs.libp2p.status}`
    })

    // logger({
    //     level: LogLevel.INFO,
    //     message: `Database status: ${await orbitDb.process.ipfs.libp2p.pubsub.ls()}`
    // });

    // await testDb(database);
    // const cid = await database.add('hello');
    // logger({
    //     level: LogLevel.INFO,
    //     message: `Database test: ${cid}`
    // });

    return { database };

}

const testDb = async ( database: typeof Database) => {
    const cid = await database.add('hello');
    logger({
        level: LogLevel.INFO,
        message: `Database test: ${cid}`
    });
}



export {
    OrbitDbTypes,
    OpenDbOptions,
    openDb
}

