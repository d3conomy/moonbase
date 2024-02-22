import { OrbitDb, Database } from '@orbitdb/core';
import { createOrbitDbProcess, defaultOrbitDbOptions, OrbitDbOptions } from '../db/setupOrbitDb.js';
import { Helia } from 'helia';
import { createIPFSProcess, IPFSOptions } from '../db/setupIPFS.js';
import { createLibp2pProcess } from '../db/setupLibp2p.js';

import { expect } from 'chai';
import { Libp2p } from 'libp2p';
import { logger } from '../utils/logBook.js';
import { LogLevel } from '../utils/constants.js';

describe('CreateOrbitDbProcess', async () => {
    let id = 'test-id';
    let orbitDb10001: typeof OrbitDb | null = null;
    let libp2p00001: Libp2p | null = null;
    let ipfsProcess00001: Helia | null = null;

    beforeEach(async () => {

        orbitDb10001 = null;
        libp2p00001 = null;
        ipfsProcess00001 = null;
        // Create a mock libp2p instance
        libp2p00001 = await createLibp2pProcess();

        // Create the options object
        const options: IPFSOptions = new IPFSOptions({
            libp2p: libp2p00001,
        })

        // Call the createIPFSProcess function
        ipfsProcess00001 = await createIPFSProcess(options);

        logger({
            level: LogLevel.INFO,
            message: `IPFS process created ${ipfsProcess00001.libp2p.peerId.toString()}`
        });

        // Assert that the IPFS node is created successfully
        expect(ipfsProcess00001.libp2p.peerId.toString()).to.be.a("string");
    });


    afterEach(async () => {
        // Clean up any resources if needed
        await ipfsProcess00001?.libp2p.stop()
        await libp2p00001?.stop()
        await orbitDb10001?.ipfs.libp2p.stop()
        orbitDb10001 = null
    })


    it('should create an OrbitDb instance with the given IPFS and options', async () => {
        if (!ipfsProcess00001) {
            logger({
                level: LogLevel.ERROR,
                message: 'IPFS process not found'
            });
            return;
        }

        orbitDb10001 = await createOrbitDbProcess({
            ipfs: ipfsProcess00001,
            enableDID: false
        })

        logger({
            level: LogLevel.INFO,
            message: `OrbitDb process created`
        });

        // expect(orbitDb10001.ipfs.libp2p.peerId.toString().length).is.greaterThan(0);
    });

});
