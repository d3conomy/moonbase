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
    let libp2pProcess2: Libp2p;

    before(async () => {
        // Add any setup code here
        libp2pProcess = await createLibp2pProcess();
    });

    it('should create a Libp2p Process with default options', async () => {
        // libp2pProcess = await createLibp2pProcess();
        expect(libp2pProcess.peerId.toString()).to.be.a('string');
        // Add more assertions to validate the created Libp2p node
    });

    it('should create two simultaneous Libp2p Processes', async () => {
        libp2pProcess2 = await createLibp2pProcess();
        expect(libp2pProcess2.peerId.toString()).to.not.equal(libp2pProcess.peerId.toString());
        // Add more assertions to validate the second created Libp2p node
    })



    after(async () => {
        // Add any cleanup code here
        await libp2pProcess.stop();
        await libp2pProcess2.stop();
    });
});
