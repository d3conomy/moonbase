import { Db } from '../db/index.js';
import { Manager } from '../db/manager.js';
import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

import { expect } from 'chai';
import { Component, LogLevel } from '../utils/constants.js';
import { Node } from '../db/node.js';
import { logger } from '../utils/logBook.js';
import { log } from 'console';

describe('Db', () => {
    let db: Db;

    beforeEach(() => {
        
    });

    it('should initialize the Db', async () => {
        // await db.init();
        db = new Db();
        await db.init();
        expect(db.manager).to.be.instanceOf(Manager);
        expect(db.opened.size).to.equal(0);
    });

    it('should create the required nodes', async () => {
        db = new Db();
        await db.init();
        const allNodes = db.manager.getAllNodes();
        logger({
            level: LogLevel.INFO,
            message: `All nodes: ${JSON.stringify(allNodes)}`
        });
        expect(allNodes.length).to.equal(3);
    });

    it('should open a database', async () => {
        db = new Db();
        db.init().then(() => {;
            const orbitDbNodes: Node[] = db.manager.getNodesByType(Component.ORBITDB);

            const orbitDbNode = orbitDbNodes[0];
            logger({
                level: LogLevel.INFO,
                message: `OrbitDB node: ${JSON.stringify(orbitDbNode)}`
            });

            const openDbOptions: OpenDbOptions = {
                id: 'db1',
                orbitDb: orbitDbNode,
                dbName: 'testDb',
                dbType: OrbitDbTypes.EVENTS,
            };

            db.open(openDbOptions).then(() => {
                expect(db.opened.size).to.equal(1);
            
            })
            // expect(db.opened.size).to.equal(1);
        });
        // expect(db.opened.get('db1')).to.be('OrbitDB');
    });

    afterEach(() => {
        // Clean up any opened databases
        db.opened.forEach((dbInstance) => {
            dbInstance.close();
        });
        db.opened.clear();
        db.manager.nodes.forEach((node: Node) => {
            db.manager.closeNode(node.id);
        });
    });
});
