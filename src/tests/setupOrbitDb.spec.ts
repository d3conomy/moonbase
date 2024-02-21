import { OrbitDb, Database } from '@orbitdb/core';
import { createOrbitDbProcess, OrbitDbOptions } from '../db/setupOrbitDb.js';
import { Helia } from 'helia';
import { createIPFSProcess, IPFSOptions } from '../db/setupIPFS.js';
import { createLibp2pProcess } from '../db/setupLibp2p.js';

import { expect } from 'chai';
import { Libp2p } from 'libp2p';
import { logger } from '../utils/logBook.js';
import { LogLevel } from '../utils/constants.js';

describe('createOrbitDbProcess', async () => {
    let orbitDb: any;
    let ipfs: Helia;
    let libp2p: Libp2p;

    before(() => {
        
    });

    it('should create an OrbitDb instance with the given IPFS and options', async () => {
        // Mock IPFS instance
        // createLibp2pProcess().then((libp2pInstance) => {
        //     libp2p = libp2pInstance;
        // });
        // const ipfsOptions = new IPFSOptions({
        //     libp2p: libp2p,
        // });
        // createIPFSProcess(ipfsOptions).then((ipfsInstance) => {
        //     ipfs = ipfsInstance;
        // });

        libp2p = await createLibp2pProcess();
        const ipfsOptions = new IPFSOptions({
            libp2p: libp2p,
        });

        ipfs = await createIPFSProcess(ipfsOptions);
        logger({
            level: LogLevel.INFO,
            message: `IPFS process created`
        });

        // Mock options
        const options: OrbitDbOptions = {
            ipfs: ipfs,
            enableDID: true
        };

        orbitDb = await createOrbitDbProcess(options) as typeof OrbitDb
        logger({
            level: LogLevel.INFO,
            message: `OrbitDb process created ${orbitDb.ipfs.libp2p.peerId.toString()}, ${orbitDb.ipfs.libp2p.getMultiaddrs()}`
        });
        // orbitDb.open('test').then((db: any) => {
        //     logger({
        //         level: LogLevel.INFO,
        //         message: `Database opened`
        //     });
    
        // console.log(`${db.database}`);
        // try {
        //     const db: typeof Database = await orbitDb.open('test-123', { type: 'events' });
        //     logger({
        //         level: LogLevel.INFO,
        //         message: `Database opened: ${db.address.toString()}`
        //     });
        // }
        // catch (error: any) {
        //     logger({
        //         level: LogLevel.ERROR,
        //         message: `Error opening database: ${error.message}, ${error.stack}, ${error.name}`
        //     });
        // }
        expect(orbitDb).to.be.instanceOf(Object);
        // Call the function
        // createOrbitDbProcess(options).then((orbitDbInstance) => {;
            // expect(orbitDbInstance.identity.provider).to.be.instanceOf(Object);
        // });
        // Add more assertions as needed
    });

    after(async () => {
        // Clean up
        await libp2p.stop();
    });

});
