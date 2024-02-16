// import { Manager } from '../db/manager.js';
// import { expect } from 'chai';
// import { Component, LogLevel, ResponseCode } from '../utils/constants.js';
// import { logger } from '../utils/logBook.js';
// import { createRandomId } from '../utils/id.js';
// import { Node } from '../db/node.js';


// describe('Manager', async () => {
//     let manager: Manager;
//     let id: string;

//     beforeEach(() => {
//         manager = new Manager();
//         id = `test-id-${createRandomId()}`;
//     });

//     it('should create a node', async () => {


//     it('should create a node', async () => {
//         const type = Component.LIBP2P;
//         // const options = { /* provide your test options here */ };
        
//         await manager.createNode({
//             id,
//             type
//         });

//         const allNodes = manager.getAllNodes()
//         allNodes.forEach((node) => {
//             console.log(`node: ${node.id}`);
//         });
//         expect(manager.getNode(id)).to.be.instanceOf(Node);
//     });

//     // Add more test cases as needed
//     afterEach(() => {
//         try {
//             manager.closeNode(id);
//         }
//         catch (e: any) {
//             logger({
//                 level: LogLevel.ERROR,
//                 component: Component.SYSTEM,
//                 code: ResponseCode.SERVICE_UNAVAILABLE,
//                 message: e.message
//             });
//         }
//     });
// });
