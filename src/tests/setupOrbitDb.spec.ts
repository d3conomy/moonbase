import { OrbitDb } from '@orbitdb/core';
import { createOrbitDbNode, OrbitDbOptions } from '../db/setupOrbitDb.js';
import { Helia } from 'helia';
import { createIPFSNode, IPFSOptions } from '../db/setupIPFS.js';
import { createLibp2pNode } from '../db/setupLibp2p.js';

import { expect } from 'chai';
import { Libp2p } from 'libp2p';

describe('createOrbitDbNode', async () => {
    let orbitDb: typeof OrbitDb;
    let ipfs: Helia;
    let libp2p: Libp2p;

    before(async () => {
        libp2p = await createLibp2pNode();
        const ipfsOptions = new IPFSOptions({
            libp2p: libp2p,
        });
        ipfs = await createIPFSNode(ipfsOptions);

        // Mock options
        const options: OrbitDbOptions = {
            ipfs: ipfs,
            enableDID: true
        };

        // Call the function
        orbitDb = await createOrbitDbNode(options);
    });

    it('should create an OrbitDb instance with the given IPFS and options', async () => {
        // Mock IPFS instance
        

        // Assert the result
        expect(orbitDb.identity.provider).to.be.a('undefined');
        // Add more assertions as needed
    });

    after(async () => {
        // Clean up
        libp2p.stop();
    });

});
