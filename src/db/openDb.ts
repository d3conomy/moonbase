import { createRandomId } from '../utils/id.js';
import {
    OrbitDbOptions,
    defaultOrbitDbOptions,
    createOrbitDbNode
} from './setupOrbitDb.js';

import {
    OrbitDb
} from '@orbitdb/core';

enum OrbitDbTypes {
    EVENTS = 'events',
    DOCUMENTS = 'docstore',
    KEYVALUE = 'keyvalue',
    KEYVALUEINDEXED = 'keyvalueindexed'
}

class OpenDbOptions {
    public id: string;
    public orbitDb: typeof OrbitDb;
    public dbName: string;
    public dbType: OrbitDbTypes;

    constructor(
        orbitDb: typeof OrbitDb,
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

const createOpenDb = async ({
    orbitDb,
    dbName,
    dbType
}: OpenDbOptions) => {
    
    return await orbitDb.open(dbName, { type: dbType });
}

export {
    OpenDbOptions,
    createOpenDb
}

