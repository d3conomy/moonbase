import { createIpfsProcess, _IpfsOptions, IpfsProcess } from "../db/ipfs.js";
import { createLibp2pProcess, Libp2pProcess } from "../db/libp2p.js";
import { Helia } from "helia";

import { expect } from "chai";
import { Libp2p } from "libp2p";
import { LogLevel } from "../utils/constants.js";
import { logger } from "../utils/logBook.js";

describe("createIpfsProcess", async () => {
    let libp2p: Libp2pProcess
    let libp2p2: Libp2pProcess
    let ipfs: IpfsProcess;
    let ipfs2: IpfsProcess;

    it("should create an Ipfs node with the provided options", async () => {
        // Create a mock libp2p instance
        libp2p = new Libp2pProcess({});

        // Create the options object
        const options: _IpfsOptions = new _IpfsOptions({
            libp2p,
        });

        // Call the createIpfsProcess function
        ipfs = new IpfsProcess({options});
        await ipfs.init();

        await ipfs.start();

        logger({
            level: LogLevel.INFO,
            message: `Ipfs id: ${ipfs.id.getId()}`
        })

        logger({
            level: LogLevel.INFO,
            message: `Ipfs status: ${ipfs.process?.libp2p.status}`
        })

        logger({
            level: LogLevel.INFO,
            message: `Ipfs id: ${ipfs.process?.libp2p.peerId.toString()}`
        })

        // Assert that the Ipfs node is created successfully
        expect(ipfs.process?.libp2p.peerId.toString()).to.be.a("string");
        // Add more assertions based on your specific requirements
        await ipfs.process?.stop();
        await libp2p.stop();
    });

    it("should create two simultaneous Ipfs nodes", async () => {
        // Create a mock libp2p instance
        libp2p = new Libp2pProcess({});
        libp2p2 = new Libp2pProcess({});

        // Create the options object
        const options: _IpfsOptions = new _IpfsOptions({
            libp2p,
        });

        const options2: _IpfsOptions = new _IpfsOptions({
            libp2p: libp2p2,
        });

        // Call the createIpfsProcess function
        ipfs = new IpfsProcess({options});
        ipfs2 = new IpfsProcess({options: options2});

        await ipfs.init();
        await ipfs2.init();

        // Assert that the Ipfs node is created successfully
        expect(ipfs.process?.libp2p.peerId.toString()).to.be.a("string");
        expect(ipfs2.process?.libp2p.peerId.toString()).to.be.a("string");
        expect(ipfs.process?.libp2p.peerId.toString()).to.not.equal(ipfs2.process?.libp2p.peerId.toString());
        // Add more assertions based on your specific requirements
    });

    afterEach(async () => {
        // await libp2p?.stop();
        // await libp2p2?.stop();
        // Clean up any resources if needed
        await ipfs?.process?.stop();
        await ipfs2?.process?.stop();
    });


});
