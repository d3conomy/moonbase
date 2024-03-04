
import {
    OpenDb,
    OrbitDbTypes,
    _OpenDbOptions
} from '../db/open.js';

import {
    expect
} from 'chai';

import {
    Component,
    LogLevel
} from '../utils/constants.js';


import {
    logger
} from '../utils/logBook.js';

import {
    Database
} from '@orbitdb/core';
import { IdReference } from '../utils/id.js';
import { OrbitDbProcess, _OrbitDbOptions } from '../db/orbitDb.js';
import { Libp2pProcess } from '../db/libp2p.js';
import { IpfsProcess, _IpfsOptions } from '../db/ipfs.js';


describe('OpenDb', () => {
    let db: OpenDb;
    let ipfs: IpfsProcess;
    let orbitDb: OrbitDbProcess;
    let libp2p: Libp2pProcess;

    beforeEach( async () => {
        libp2p = new Libp2pProcess({});

        await libp2p.init();

        ipfs = new IpfsProcess({
            options: new _IpfsOptions({
                libp2p
            })
        });

        await ipfs.init();
        await ipfs.start();

        orbitDb = new OrbitDbProcess({
            id: new IdReference({
                component: Component.ORBITDB
            }),
            options: new _OrbitDbOptions({
                ipfs
            })
        });

        await orbitDb.init();
    });

    it('should open a database', async () => {
        
        const dbOptions = new _OpenDbOptions({
            orbitDb,
        });

        db = new OpenDb({options: dbOptions});

        await db.init();

        expect(db.process).to.be.not.null;
        expect(db.process.address).to.be.not.null;

        logger({
            level: LogLevel.INFO,
            message: `Database address: ${db.process.address}`
        });

        const cid = await db.add('hello');
        logger({
            level: LogLevel.INFO,
            message: `Test cid: ${cid}`
        });

        const testGet = await db.get(cid);
        logger({
            level: LogLevel.INFO,
            message: `Test get: ${testGet}`
        });

        const all = await db.all();
        logger({
            level: LogLevel.INFO,
            message: `All: ${JSON.stringify(all)}`
        });
    });

    it('should open a keyvalue database', async () => {
        const dbOptions = new _OpenDbOptions({
            orbitDb,
            databaseType: OrbitDbTypes.KEYVALUE
        });

        db = new OpenDb({options: dbOptions});

        await db.init();

        expect(db.process).to.be.not.null;
        expect(db.process.address).to.be.not.null;

        logger({
            level: LogLevel.INFO,
            message: `Database address: ${db.process.address}`
        });

        const cid = await db.put('hello', 'world');
        logger({
            level: LogLevel.INFO,
            message: `Test cid: ${'cid'}`
        });

        const testGet = await db.get('hello');
        logger({
            level: LogLevel.INFO,
            message: `Test get: ${testGet}`
        });

        await db.del('hello');
    });

    afterEach(async () => {
        await db.stop();
        await orbitDb.stop();
        await ipfs.stop();
        await libp2p.stop();
    })
});
