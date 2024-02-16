import { OrbitDb } from '@orbitdb/core';
import { createOrbitDbProcess, OrbitDbOptions } from '../db/setupOrbitDb.js';
import { Helia } from 'helia';
import { createIPFSProcess, IPFSOptions } from '../db/setupIPFS.js';
import { createLibp2pProcess } from '../db/setupLibp2p.js';

import { expect } from 'chai';
import { Libp2p } from 'libp2p';

describe('createOrbitDbProcess', async () => {
    let orbitDb: typeof OrbitDb;
    let ipfs: Helia;
    let libp2p: Libp2p;

    before(() => {
        
    });

    it('should create an OrbitDb instance with the given IPFS and options', async () => {
        // Mock IPFS instance
        libp2p = await createLibp2pProcess();
        const ipfsOptions = new IPFSOptions({
            libp2p: libp2p,
        });
        ipfs = await createIPFSProcess(ipfsOptions);

        // Mock options
        const options: OrbitDbOptions = {
            ipfs: ipfs,
            enableDID: true
        };

        // Call the function
        createOrbitDbProcess(options).then((orbitDbInstance) => {;
            expect(orbitDbInstance.identity.provider).to.be.instanceOf(Object);
        });
        // Add more assertions as needed
    });

    after(async () => {
        // Clean up
        libp2p.stop();
    });

});
