// import { Db } from '../db/index.js';
// import { Manager } from '../db/manager.js';
// import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

// import { expect } from 'chai';
// import { Component, LogLevel } from '../utils/constants.js';
// import { Node } from '../db/node.js';
// import { logger } from '../utils/logBook.js';
                                                              

// describe('Db', () => {
//     let db: Db;

//     beforeEach(() => {
        
//     });

//     it('should initialize the Db', () => {
//         // await db.init();
//         db = new Db();
//         db.init();
//         expect(db.manager).to.be.instanceOf(Manager);
//         expect(db.opened.size).to.equal(0);
//     });

//     it('should create the required nodes', async () => {
//         db = new Db();
//         await db.init();
//         const allNodes = db.manager.getAllNodes();
//         logger({
//             level: LogLevel.INFO,
//             message: `All nodes: ${JSON.stringify(allNodes)}`
//         });
//         expect(allNodes.length).to.equal(3);
//     });

//     it('should open a database', async () => {
//         db = new Db();
//         await db.init()
//         const orbitDbNodes: Node[] = db.manager.getNodesByType(Component.ORBITDB);

//         const orbitDbNode = orbitDbNodes[0];
//         logger({
//             level: LogLevel.INFO,
//             message: `OrbitDB node: ${JSON.stringify(orbitDbNode)}`
//         });

//         const openDbOptions = {
//             id: 'db1',
//             orbitDb: orbitDbNode.process,
//             databaseName: 'testDb',
//             databaseType: OrbitDbTypes.EVENTS,
//         };

//         db.open(openDbOptions).then(() => {
//             logger({
//                 level: LogLevel.INFO,
//                 message: `Db opened: ${db.opened.get('db1')}`
//             });
//             expect(db.opened.size).to.equal(1);
        
//         })
//             // expect(db.opened.size).to.equal(1);

//         expect(db.opened.get('db1')).to.be('OrbitDB');
//     });

//     // afterEach(() => {
//     //     // Clean up any opened databases
//     //     db.opened.forEach((dbInstance) => {
//     //         dbInstance.close();
//     //     });
//     //     db.opened.clear();
//     //     db.manager.nodes.forEach((node: Node) => {
//     //         db.manager.closeNode(node.id);
//     //     });
//     // });
// });
