// import { OrbitDb , Database} from '@orbitdb/core';
// import { Command } from '../db/commands.js';
// import { Node, ProcessTypes } from '../db/node.js';
// import { Component, LogLevel } from '../utils/constants.js';
// import { expect } from 'chai';
// import { Manager } from '../db/manager.js';
// import { logger } from '../utils/logBook.js';
// import { Db } from '../db/index.js';
// import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

// describe('CommandsOpenDb', async () => {
//     let command: Command | null = null;
//     let newDb: Db | null = null;

//     beforeEach(() => {
//         //create the processInstance

//         let kwargs = new Map<string, string>();
//         kwargs.set('key', 'hello')
//         kwargs.set('value', 'world')

//         logger({
//             level: LogLevel.INFO,
//             component: Component.SYSTEM,
//             message: `Kwargs: ${JSON.stringify(kwargs.get('value'))},`
//         });

//         command = new Command({
//             nodeId: 'node1',
//             type: Component.DB,
//             action: 'put',
//             kwargs: kwargs
//         });
//     });

//     afterEach(async () => {
//         // Clean up any resources if needed
//         if (command) {
//             command = null;
//         }
//         await newDb?.manager.closeAllNodes();
//         newDb = null;
//     });

//     it('should create a new command instance', () => {
//         expect(command).to.be.not.null;
//         expect(command?.nodeId).to.be.equal('node1');
//         expect(command?.id).to.be.not.null;
//         expect(command?.type).to.be.equal(Component.DB);
//         expect(command?.action).to.be.equal('put');
//         // expect(command.kwargs).to.equal(new Map<string, any>());
//     });

//     it('should set the output of the command', () => {
//         command?.setOutput('output1');
//         expect(command?.output).to.be.not.null;
//     });

//     it('should execute the command', async () => {
//         let newDb: Db | null = new Db();
//         await newDb.init();

//         const orbitDbNodes = newDb.manager.getNodesByType(Component.ORBITDB);

//         const orbitDbNode = orbitDbNodes[0];

//         logger({
//             level: LogLevel.INFO,
//             component: Component.SYSTEM,
//             message: `OrbitDB node: ${JSON.stringify(orbitDbNode.id)}`
//         });

//         const openDbOptions = new OpenDbOptions({
//             id: 'node1',
//             orbitDb: orbitDbNode,
//             databaseName: 'orbitDbNode',
//             databaseType: OrbitDbTypes.EVENTS,
//         });

//         let db = await newDb.open(openDbOptions)
//         // while (!db?.process) {
//         //     await new Promise((resolve) => setTimeout(resolve, 1000));
//         // }
//         logger({
//             level: LogLevel.INFO,
//             component: Component.SYSTEM,
//             message: `Db opened: ${db?.id}, ${db?.process.address}`
//         });

//         try {
//             // expect(db).to.be.not.null;

//             const command1 = {
//                 nodeId: db ? db?.id : 'newid',
//                 type: Component.DB,
//                 action: 'add',
//                 kwargs: new Map<string, string>([['key', 'hello'], ['value', 'world']])
//             };
//             // const result = await db.execute(command1)
//             let commandOutput = await newDb.executeCommand(command1);
//             logger({
//                 level: LogLevel.INFO,
//                 component: Component.SYSTEM,
//                 message: `Command executed: ${commandOutput.id}, Output ${commandOutput.output}`
//             });
//             expect(commandOutput.output).to.be.not.null;
//             expect(newDb.open.length).to.be.equal(1);
//         }
//         catch (error) {
//             logger({
//                 level: LogLevel.ERROR,
//                 component: Component.SYSTEM,
//                 message: `Error executing command: ${error}`
//             });
//         }

//         // }
//     });
// });