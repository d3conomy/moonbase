import {
    openDb, OpenDbOptions
} from '../db/openDb.js';

import {
    Db
} from '../db/index.js';

import {
    OrbitDbTypes
} from '../db/openDb.js';

import {
    expect
} from 'chai';

import {
    Component,
    LogLevel
} from '../utils/constants.js';

import {
    Manager
} from '../db/manager.js';

import {
    Node
} from '../db/node.js';

import {
    logger
} from '../utils/logBook.js';

import {
    Database
} from '@orbitdb/core';
import exp from 'constants';


describe('OpenDb', () => {
    let dbManager = new Db();
    let db: typeof Database;

    beforeEach(async () => {
        await dbManager.init();

        const orbitDbNode = dbManager.manager.getNodesByType(Component.ORBITDB)[0];

        expect(orbitDbNode).to.be.instanceOf(Node);

        // const options = new OpenDbOptions({
        //     orbitDb: orbitDbNode,
        //     id: 'db1',
        //     databaseName: 'testDb',
        //     databaseType: OrbitDbTypes.EVENTS
        // });

        // db = await dbManager.open(options)
        // logger({
        //     level: LogLevel.INFO,
        //     message: `Db: ${JSON.stringify(db.address.toString())}`
        // });
    });


    it('should create the required nodes', () => {
        const allNodes = dbManager.manager.getAllNodes();
        logger({
            level: LogLevel.INFO,
            message: `All nodes: ${allNodes.map((node) => node.process)}`
        });
        expect(allNodes.length).to.equal(3);
    });

    it('should open a database', async () => {
        const orbitDbNodes: Node[] = dbManager.manager.getNodesByType(Component.ORBITDB);

        const orbitDbNode = orbitDbNodes[0];
        logger({
            level: LogLevel.INFO,
            message: `OrbitDB node: ${orbitDbNode}`
        });

        const openDbOptions = new OpenDbOptions({
            id: 'db1',
            orbitDb: orbitDbNode,
            databaseName: 'testDb',
            databaseType: OrbitDbTypes.EVENTS,
        });

        logger({
            level: LogLevel.INFO,
            message: `OpenDb options: ${openDbOptions}`
        });

        db = await dbManager.open(openDbOptions);

        await db.database.add("hello");
    });
});
