
import {
    OpendDb,
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
    let db: typeof Database | null = null;

    it('should open a database', async () => {
        const libp2p = new Libp2pProcess({});

        await libp2p.init();

        const ipfs = new IpfsProcess({
            options: new _IpfsOptions({
                libp2p
            })
        });

        await ipfs.init();
        await ipfs.start();

        const orbitDb = new OrbitDbProcess({
            id: new IdReference({
                component: Component.ORBITDB
            }),
            options: new _OrbitDbOptions({
                ipfs
            })
        });

        await orbitDb.init();

        const dbOptions = new _OpenDbOptions({
            orbitDb,
        });

        db = new OpendDb({options: dbOptions});

        await db.init();

        expect(db.process).to.be.not.null;
        expect(db.process.address).to.be.not.null;
        // expect(db?.address).to.be.a('string');
        // expect(db.address).to.be.not.empty;

        logger({
            level: LogLevel.INFO,
            message: `Database address: ${db.process.address}`
        });

        await orbitDb.stop();
        await ipfs.stop();
        await libp2p.stop();
    });

    afterEach(async () => {
        await db.process.close();
        db = null;
    });
});
