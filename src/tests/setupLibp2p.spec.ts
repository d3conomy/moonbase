import { createLibp2pProcess, defaultLibp2pOptions } from '../db/setupLibp2p.js';
import { Libp2p } from 'libp2p';
import { expect } from 'chai';
import { logger } from '../utils/logBook.js';
import { Component, LogLevel } from '../utils/constants.js';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


describe('createLibp2pProcess', () => {
    let libp2pProcess: Libp2p;

    before(async () => {
        // Add any setup code here
        libp2pProcess = await createLibp2pProcess();
    });

    it('should create a Libp2p Process with default options', async () => {
        // libp2pProcess = await createLibp2pProcess();
        expect(libp2pProcess.peerId.toString()).to.be.a('string');
        // Add more assertions to validate the created Libp2p node
    });

    it('should get connections from the Libp2p process', async () => {
        sleep(1800).then(() => {
            const connections = libp2pProcess.getConnections();
            logger({
                level: LogLevel.INFO,
                component: Component.LIBP2P,
                message: `Connections: ${JSON.stringify(connections)}`
            });
            expect(connections).to.be.an('array').with.length.greaterThan(0);
        });
        // Add more assertions to validate the connections
    });

    after(() => {
        // Add any cleanup code here
        libp2pProcess.stop();
    });
});
