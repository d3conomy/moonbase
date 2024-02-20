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


// describe('OpenDb', () => {
//     let dbManager = new Db();
//     let db: OpenDb;

//     beforeEach(() => {
//         dbManager.init();

//         const orbitDbNode = dbManager.manager.getNodesByType(Component.ORBITDB)[0];

//         const options = new OpenDbOptions({
//             orbitDb: orbitDbNode,
//             id: 'db1',
//             databaseName: 'testDb',
//             databaseType: OrbitDbTypes.EVENTS
//         });

//         db = new OpenDb({
//             orbitDb: orbitDbNode,
//             options: options
//         });
//         logger({
//             level: LogLevel.INFO,
//             message: `Db: ${JSON.stringify(db)}`
//         });
//     });


//     it('should create the required nodes', () => {
//         const allNodes = dbManager.manager.getAllNodes();
//         logger({
//             level: LogLevel.INFO,
//             message: `All nodes: ${JSON.stringify(allNodes)}`
//         });
//         expect(allNodes.length).to.equal(3);
//     });

//     it('should open a database', async () => {
//         const orbitDbNodes: Node[] = dbManager.manager.getNodesByType(Component.ORBITDB);

//         const orbitDbNode = orbitDbNodes[0];
//         logger({
//             level: LogLevel.INFO,
//             message: `OrbitDB node: ${JSON.stringify(orbitDbNode)}`
//         });

//         const openDbOptions = {
//             id: 'db1',
//             orbitDb: orbitDbNode,
//             databaseName: 'testDb',
//             databaseType: OrbitDbTypes.EVENTS,
//         };

//         logger({
//             level: LogLevel.INFO,
//             message: `OpenDb options: ${JSON.stringify(openDbOptions)}`
//         });

//         const db = new OpenDb({
//             orbitDb: orbitDbNode,
//             options: openDbOptions
//         });

//         await db.openDb().then(() => {
//             logger({
//                 level: LogLevel.INFO,
//                 message: `Db opened: ${dbManager.opened.get('db1')}`
//             });
//             expect(dbManager.opened.size).to.equal(1);
//         });
//     });
// });
