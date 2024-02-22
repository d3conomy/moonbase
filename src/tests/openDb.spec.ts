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
import { Command } from '../db/commands.js';


describe('OpenDb', () => {
    let dbManager: Db | null = null;
    let db: typeof Database | null = null;
    let allNodes: Node[] | null | undefined = undefined;

    beforeEach(async () => {
        dbManager = null;
        allNodes = null;
        dbManager = new Db();
        await dbManager.init();

        // const orbitDbNode = dbManager.manager.getNodesByType(Component.ORBITDB)[0];

        db = null

        allNodes = dbManager.manager.getAllNodes();
        logger({
            level: LogLevel.INFO,
            message: `All nodes: ${allNodes.map((node) => node.id)}`
        });

        // expect(orbitDbNode).to.be.instanceOf(Node);

    });

    afterEach(async () => {
        if (db !== null) {
            
            if (db.address !== '') {

                await db.stop()
            }
        }

        await dbManager?.manager.closeAllNodes();

        db = null
        dbManager = null
        allNodes = null
    })


    it('should create the required nodes', () => {
        allNodes = dbManager?.manager.getAllNodes();
        logger({
            level: LogLevel.INFO,
            message: `All nodes: ${allNodes?.map((node) => node.id)}`
        });
        expect(allNodes?.length).to.equal(3);
    });

    it('should open a database', async () => {
       

        const orbitDbNodes: Node[] | null | undefined = dbManager?.manager.getNodesByType(Component.ORBITDB);

        const orbitDbNode = orbitDbNodes ? orbitDbNodes[0] : null;
        logger({
            level: LogLevel.INFO,
            message: `OrbitDB node: ${orbitDbNode}`
        });

        if (!orbitDbNode) {
            logger({
                level: LogLevel.ERROR,
                message: 'No OrbitDB node available'
            });
            return
        }

        const openDbOptions = new OpenDbOptions({
            id: 'db1',
            orbitDb: orbitDbNode,
            databaseName: 'testDb',
            databaseType: OrbitDbTypes.EVENTS,
        });

        logger({
            level: LogLevel.INFO,
            message: `OpenDb options: ${JSON.stringify(openDbOptions.id)}`
        });

        db = await dbManager?.open(openDbOptions);

        logger({
            level: LogLevel.INFO,
            message: `Database opened: ${db?.process.address.toString()}`
        });

        const dbAddCommand = new Command({
            nodeId: 'db1',
            type: Component.DB,
            action: 'add',
            kwargs: new Map<string, any>([
                ['key', 'key1'],
                ['kvalue', 'value1']
            ])
        });

        const dbgetAllCommand = new Command({
            nodeId: 'db1',
            type: Component.DB,
            action: 'all',
        });

        // await dbManager?.executeCommand(dbAddCommand);
        // })
        // let command = await dbManager?.executeCommand(dbgetAllCommand)

        // logger({
        //     level: LogLevel.INFO,
        //     message: `Database opened, all entries: ${command?.output}`
        // });

        expect(db.id).to.be.not.null;
    });
});
