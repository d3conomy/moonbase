import { Db } from '../db/index.js';
import { Manager } from '../db/manager.js';
import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

import { expect } from 'chai';
import { Component, LogLevel } from '../utils/constants.js';
import { Node } from '../db/node.js';
import { logger } from '../utils/logBook.js';
                                                              

describe('Db', () => {
    let db: Db | null = null;

    beforeEach( async () => {
        db = new Db();
        await db.init();

        if (!db) {

        }
        expect(db.manager).to.be.instanceOf(Manager);
        expect(db.opened.size).to.equal(0);
    });

    afterEach( async () => {

        let allNodes = db?.manager.getAllNodes();
        // logger({
        //     level: LogLevel.INFO,
        //     message: `All nodes: ${JSON.stringify(allNodes)}`
        // });
        allNodes?.forEach(async (node: Node) => {
            await node.stop();
        })
        // db?.opened.clear();
        db?.manager.nodes.forEach(async (node: Node) => {
            await db?.manager.closeNode(node.id);
        });
    })

    it('should create the required nodes', async () => {
        let allNodes = db?.manager.getAllNodes();

        logger({
            level: LogLevel.INFO,
            message: `All nodes: ${allNodes?.map((node) => node.id)}`
        });
        
        expect(allNodes?.length).to.equal(3);

    });

    // it('should open a database', async () => {
    //     db = new Db();
    //     await db.init()
    //     const orbitDbNodes: Node[] = db.manager.getNodesByType(Component.ORBITDB);

    //     const orbitDbNode = orbitDbNodes[0];
    //     logger({
    //         level: LogLevel.INFO,
    //         message: `OrbitDB node: ${JSON.stringify(orbitDbNode)}`
    //     });

    //     const openDbOptions = {
    //         id: 'db1',
    //         orbitDb: orbitDbNode.process,
    //         databaseName: 'testDb',
    //         databaseType: OrbitDbTypes.EVENTS,
    //     };

    //     db.open(openDbOptions).then(() => {
    //         logger({
    //             level: LogLevel.INFO,
    //             message: `Db opened: ${db.opened.get('db1')}`
    //         });
    //         expect(db.opened.size).to.equal(1);
        
    //     })
    //         // expect(db.opened.size).to.equal(1);

    //     expect(db.opened.get('db1')).to.be('OrbitDB');
    // });

    // afterEach( async () => {
    //     // Clean up any opened databases
    //     db.opened.forEach( async (dbInstance) => {
    //         await dbInstance.stop();
    //     });
    //     db.opened.clear();
    //     db.manager.nodes.forEach((node: Node) => {
    //         db.manager.closeNode(node.id);
    //     });
    // });
});
