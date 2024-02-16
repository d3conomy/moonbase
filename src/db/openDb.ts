import { createRandomId } from '../utils/id.js';
import { Node } from './node.js';
import {
    OrbitDbOptions,
    defaultOrbitDbOptions,
    createOrbitDbProcess
} from './setupOrbitDb.js';

import {
    OrbitDb,
    Database
} from '@orbitdb/core';

enum OrbitDbTypes {
    EVENTS = 'events',
    DOCUMENTS = 'docstore',
    KEYVALUE = 'keyvalue',
    KEYVALUEINDEXED = 'keyvalueindexed'
}

class OpenDbOptions {
    public id: string;
    public orbitDb: Node;
    public dbName: string;
    public dbType: OrbitDbTypes;

    constructor(
        orbitDb: Node,
        id?: string,
        dbName?: string,
        dbType?: OrbitDbTypes
    ) {
        this.orbitDb = orbitDb;
        this.dbName = dbName ? dbName : createRandomId()
        this.dbType = dbType ? dbType : OrbitDbTypes.EVENTS;
        this.id = id ? id : `${this.dbName}-${this.dbType}`
    }
}

const openDb = async ({
    orbitDb,
    dbName,
    dbType
}: OpenDbOptions
): Promise<typeof Database> => {
    
    return await orbitDb.process.open(dbName, { type: dbType });
}

export {
    OrbitDbTypes,
    OpenDbOptions,
    openDb
}

