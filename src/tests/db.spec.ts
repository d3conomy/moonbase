// import { Db } from '../db/index.js';
// import { Manager } from '../db/manager.js';
// import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

// import { expect } from 'chai';
// import { Component, LogLevel } from '../utils/constants.js';
// import { Node } from '../db/node.js';
// import { logger } from '../utils/logBook.js';
                                                              

// describe('Db', () => {
//     let db: Db | null = null;
//     let allNodes: Node[] | null | undefined = undefined;

//     beforeEach( async () => {
//         db = null
//         allNodes = null
//         db = new Db();

//         await db.init();

//         // if (!db) {

//         // }
//         // expect(db.manager).to.be.instanceOf(Manager);
//         // expect(db.opened.size).to.equal(0);
//     });

//     afterEach( async () => {

//         allNodes = db?.manager.getAllNodes();
//         logger({
//             level: LogLevel.INFO,
//             message: `All nodes: ${allNodes?.map((node) => node.id)}`
//         });
//         await db?.manager.closeAllNodes();
//         db = null
//         allNodes = null

//         logger({
//             level: LogLevel.INFO,
//             message: `nodes should be empty: ${allNodes}`
//         })
        
//     })

//     // it('should create the required nodes', async () => {
//     //     allNodes = db?.manager.getAllNodes();

//     //     logger({
//     //         level: LogLevel.INFO,
//     //         message: `All nodes: ${allNodes?.map((node) => node.id)}`
//     //     });
        
//     //     expect(allNodes?.length).to.equal(3);

//     // });

//     it('should open a database', async () => {
//         // db = new Db();
//         // await db.init()
//         const orbitDbNodes: Node[] | undefined = db?.manager.getNodesByType(Component.ORBITDB);

//         if (!orbitDbNodes) {
//             logger({
//                 level: LogLevel.ERROR,
//                 message: 'No OrbitDB node available'
//             });
//         }
//         else {
//             // expect(orbitDbNodes).to.be.an('array');

//             const orbitDbNode = orbitDbNodes[0];
//             logger({
//                 level: LogLevel.INFO,
//                 message: `OrbitDB node: ${JSON.stringify(orbitDbNode.id)}`
//             });
    
//             const openDbOptions = {
//                 id: 'db1',
//                 orbitDb: orbitDbNode,
//                 databaseName: 'testDb',
//                 databaseType: OrbitDbTypes.EVENTS,
//             };

//             const openeddb = await db?.open(openDbOptions);

//             logger({
//                 level: LogLevel.INFO,
//                 message: `Db opened: ${openeddb?.process?.address.toString()}`
//             });
//             // })
    
//             // db?.open(openDbOptions).then(() => {
//             //     logger({
//             //         level: LogLevel.INFO,
//             //         message: `Db opened: ${db?.opened.get('db1')}`
//             //     });
//             //     expect(db?.opened.size).to.equal(1);
            
//             // })
//                 // expect(db.opened.size).to.equal(1);
    
//             // expect(openeddb).to.be.not.undefined;
//             // await openeddb?.stop();
//         }

//     });
// });
