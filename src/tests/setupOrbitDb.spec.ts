import { OrbitDb, Database } from '@orbitdb/core';
import { createOrbitDbProcess, defaultOrbitDbOptions, OrbitDbOptions } from '../db/setupOrbitDb.js';
import { Helia } from 'helia';
import { createIPFSProcess, IPFSOptions } from '../db/setupIPFS.js';
import { createLibp2pProcess } from '../db/setupLibp2p.js';

import { expect } from 'chai';
import { Libp2p } from 'libp2p';
import { logger } from '../utils/logBook.js';
import { LogLevel } from '../utils/constants.js';

describe('createOrbitDbProcess', () => {

    let orbitDb: typeof OrbitDb | null = null;


    afterEach(async () => {
        // Clean up any resources if needed
        await orbitDb.ipfs.libp2p.stop();
        orbitDb = null
    })


    it('should create an OrbitDb instance with the given IPFS and options', async () => {

        const libp2p = await createLibp2pProcess();
        const ipfsOptions = new IPFSOptions({
            libp2p: libp2p,
        });

        const ipfs = await createIPFSProcess(ipfsOptions);

        logger({
            level: LogLevel.INFO,
            message: `IPFS process created ${ipfs.libp2p.peerId.toString()}`
        });

        // Mock options
        const options: OrbitDbOptions = new OrbitDbOptions({
            ipfs: ipfs,
            enableDID: false
        });

        orbitDb = await createOrbitDbProcess(options)

        logger({
            level: LogLevel.INFO,
            message: `OrbitDb process created ${orbitDb}`
        });

        expect(orbitDb.ipfs.libp2p.peerId.toString().length).is.greaterThan(0);
    });

});
