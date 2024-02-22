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


// describe('OpenDb', () => {
//     let dbManager: Db | null;
//     let db: typeof Database | null

//     beforeEach(async () => {
//         dbManager = null;
//         dbManager = new Db()
//         await dbManager.init();

//         // const orbitDbNode = dbManager.manager.getNodesByType(Component.ORBITDB)[0];

//         db = null

//         const allNodes2 = dbManager.manager.getAllNodes();
//         logger({
//             level: LogLevel.INFO,
//             message: `All nodes: ${allNodes2.map((node) => node.id)}`
//         });

//         // expect(orbitDbNode).to.be.instanceOf(Node);

//     });

//     afterEach(async () => {
//         if (db !== null) {
            
//             if (db.address.toString() !== '') {

//                 await db.close()
//             }
//         }
//         db = null
//         dbManager = null
//     })


//     it('should create the required nodes', () => {
//         const allNodes = dbManager?.manager.getAllNodes();
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

//         const openDbOptions = new OpenDbOptions({
//             id: 'db1',
//             orbitDb: orbitDbNode?.process,
//             databaseName: 'testDb',
//             databaseType: OrbitDbTypes.EVENTS,
//         });

//         logger({
//             level: LogLevel.INFO,
//             message: `OpenDb options: ${JSON.stringify(openDbOptions.id)}`
//         });

//         db = await dbManager?.open(openDbOptions);

//         // await db.database.add("hello");

//         // logger({
//         //     level: LogLevel.INFO,
//         //     message: `Database opened, all entries: ${db.database.all()}`
//         // });

//         expect(db.process).to.be.instanceOf(Database);
//     });
// });
