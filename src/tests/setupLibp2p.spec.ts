import { createLibp2pNode, defaultLibp2pOptions } from '../db/setupLibp2p.js';
import { Libp2p } from 'libp2p';
import { expect } from 'chai';
import { logger } from '../utils/logBook.js';
import { Component, LogLevel } from '../utils/constants.js';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


describe('createLibp2pNode', () => {
    let libp2pNode: Libp2p;

    before(async () => {
        // Add any setup code here
    });

    it('should create a Libp2p node with default options', async () => {
        libp2pNode = await createLibp2pNode();
        expect(libp2pNode.peerId.toString()).to.be.a('string');
        // Add more assertions to validate the created Libp2p node
    });

    it('should create a Libp2p node with custom options', async () => {
        const customOptions = {
            ...defaultLibp2pOptions,
            // Add your custom options here
        };
        libp2pNode = await createLibp2pNode(customOptions);
        expect(libp2pNode.peerId.toString()).to.be.a('string');
        // Add more assertions to validate the created Libp2p node with custom options
    });

    it('should get connections from the Libp2p node', async () => {
        await sleep(1800);
        const connections = libp2pNode.getConnections();
        logger({
            level: LogLevel.INFO,
            component: Component.LIBP2P,
            message: `Connections: ${JSON.stringify(connections)}`
        });
        expect(connections).to.be.an('array').with.length.greaterThan(0);
        // Add more assertions to validate the connections
    });

    after(() => {
        // Add any cleanup code here
        libp2pNode.stop();
    });
});
