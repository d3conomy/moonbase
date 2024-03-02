// import {
//     openDb, OpenDbOptions
// } from '../db/openDb.js';

// import {
//     Db
// } from '../db/index.js';

// import {
//     OrbitDbTypes
// } from '../db/openDb.js';

// import {
//     expect
// } from 'chai';

// import {
//     Component,
//     LogLevel
// } from '../utils/constants.js';

// import {
//     Manager
// } from '../db/manager.js';

// import {
//     Node
// } from '../db/node.js';

// import {
//     logger
// } from '../utils/logBook.js';

// import {
//     Database
// } from '@orbitdb/core';
// import { Command } from '../db/commands.js';


// describe('OpenDb', () => {
//     let dbManager: Db | null = null;
//     let db: typeof Database | null = null;
//     let allNodes: Node[] | null | undefined = undefined;

//     beforeEach(async () => {
//         dbManager = null;
//         allNodes = null;
//         dbManager = new Db();
//         await dbManager.init();

//         db = null

//         allNodes = dbManager.manager.getAllNodes();
//         logger({
//             level: LogLevel.INFO,
//             message: `All nodes: ${allNodes.map((node) => node.id)}`
//         });
//     });

//     afterEach(async () => {
//         if (db !== null) {
//             if (db.address !== '') {
//                 await db.stop()
//             }
//         }

//         await dbManager?.manager.closeAllNodes();


//         db = null
//         dbManager = null
//         allNodes = null
//     })


//     it('should create the required nodes', () => {
//         allNodes = dbManager?.manager.getAllNodes();
//         logger({
//             level: LogLevel.INFO,
//             message: `All nodes: ${allNodes?.map((node) => node.id)}`
//         });
//         expect(allNodes?.length).to.equal(3);
//     });

//     it('should open a database', async () => {
       

//         const orbitDbNodes: Node[] | null | undefined = dbManager?.manager.getNodesByType(Component.ORBITDB);

//         const orbitDbNode = orbitDbNodes ? orbitDbNodes[0] : null;
//         logger({
//             level: LogLevel.INFO,
//             message: `OrbitDB node: ${orbitDbNode}`
//         });

//         if (!orbitDbNode) {
//             logger({
//                 level: LogLevel.ERROR,
//                 message: 'No OrbitDB node available'
//             });
//             return
//         }

//         const openDbOptions = {
//             id: 'db1',
//             orbitDb: orbitDbNode,
//             databaseName: 'testDb',
//             databaseType: OrbitDbTypes.EVENTS,
//         };

//         logger({
//             level: LogLevel.INFO,
//             message: `OpenDb options: ${JSON.stringify(openDbOptions.id)}`
//         });

//         db = await dbManager?.open(openDbOptions);

//         logger({
//             level: LogLevel.INFO,
//             message: `Database opened: ${db.process.address.toString()}`
//         });

//         expect(db.id).to.be.not.null;
//     });

//     it('should create two simultaneous databases', async () => {
//         const orbitDbNodes: Node[] | null | undefined = dbManager?.manager.getNodesByType(Component.ORBITDB);

//         const orbitDbNode = orbitDbNodes ? orbitDbNodes[0] : null;
//         logger({
//             level: LogLevel.INFO,
//             message: `OrbitDB node: ${orbitDbNode}`
//         });

//         if (!orbitDbNode) {
//             logger({
//                 level: LogLevel.ERROR,
//                 message: 'No OrbitDB node available'
//             });
//             return
//         }

//         const openDbOptions1 = {
//             id: 'db1',
//             orbitDb: orbitDbNode,
//             databaseName: 'testDb1',
//             databaseType: OrbitDbTypes.EVENTS,
//         };

//         const openDbOptions2 = {
//             id: 'db2',
//             orbitDb: orbitDbNode,
//             databaseName: 'testDb2',
//             databaseType: OrbitDbTypes.EVENTS,
//         };

//         const db1 = await dbManager?.open(openDbOptions1);
//         const db2 = await dbManager?.open(openDbOptions2);

//         logger({
//             level: LogLevel.INFO,
//             message: `Database 1 opened: ${db1?.process.address.toString()}`
//         });

//         logger({
//             level: LogLevel.INFO,
//             message: `Database 2 opened: ${db2?.process.address.toString()}`
//         });

//         expect(db1?.id).to.be.not.null;
//         expect(db2?.id).to.be.not.null;

//         await dbManager?.manager.closeAllNodes();
//     });
// });
