import { Manager } from '../db/manager.js';
import { expect } from 'chai';
import { Component, LogLevel, ResponseCode } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';
import { create } from 'domain';
import { createRandomId } from '../utils/id.js';


describe('Manager', async () => {
    let manager: Manager;
    let id: string;

    beforeEach(() => {
        manager = new Manager();
        id = `test-id-${createRandomId()}`;
    });

    it('should create a node', async () => {
        const nodeType = Component.LIBP2P;
        const options = { /* provide your test options here */ };
        
        await manager.createNode({
            id,
            nodeType,
            options
        });
        console.log(`getNode: ${manager.getNode(id).peerId}`);
        const allNodes = manager.getAllNodes()
        allNodes.forEach((node, value) => console.log(value));
        expect(allNodes).to.be.an('Map');
    });

    // Add more test cases as needed
    afterEach(() => {
        try {
            manager.closeNode(id);
        }
        catch (e: any) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                code: ResponseCode.SERVICE_UNAVAILABLE,
                message: e.message
            });
        }
    });
});
