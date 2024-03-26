import { createIpfsProcess, _IpfsOptions, IpfsProcess } from "../db/ipfs.js";
import { createLibp2pProcess, Libp2pProcess } from "../db/libp2p/index.js";

import { expect } from "chai";

describe("IPFS::IpfsProcess", async () => {
    let libp2p: Libp2pProcess
    let libp2p2: Libp2pProcess
    let ipfs: IpfsProcess;
    let ipfs2: IpfsProcess;

    it("should create an Ipfs node with the provided options", async () => {
        // Create a mock libp2p instance
        libp2p = new Libp2pProcess();

        // Create the options object
        const options: _IpfsOptions = new _IpfsOptions({
            libp2p,
        });

        // Call the createIpfsProcess function
        ipfs = new IpfsProcess({options});
        await ipfs.init();
        await ipfs.start();

        // Assert that the Ipfs node is created successfully
        expect(libp2p.peerId.toString()).to.be.a("string");
        // Add more assertions based on your specific requirements
        await ipfs.stop();
        await libp2p.stop();
    });

    // it("should create two simultaneous Ipfs nodes", async function () {
    //     this?.timeout(15000);
    //     // Create a mock libp2p instance
    //     libp2p = new Libp2pProcess({});
    //     libp2p2 = new Libp2pProcess({});

    //     // Create the options object
    //     const options: _IpfsOptions = new _IpfsOptions({
    //         libp2p,
    //     });

    //     const options2: _IpfsOptions = new _IpfsOptions({
    //         libp2p: libp2p2,
    //     });

    //     // Call the createIpfsProcess function
    //     ipfs = new IpfsProcess({options});
    //     ipfs2 = new IpfsProcess({options: options2});

    //     await ipfs.init();
    //     await ipfs2.init();

    //     await ipfs.start();
    //     await ipfs2.start();

    //     expect(libp2p.peerId.toString()).to.be.a("string");
    //     expect(libp2p2.peerId.toString()).to.be.a("string");
        
    //     const cid = await ipfs.addJson({name: "test"});

    //     expect(cid).to.be.a("CID");

    //     if (!cid) {
    //         expect.fail("CID not found");
    //     }
    //     const response = await ipfs2.getJson(cid?.toString());

    //     console.log(response);

    //     expect(response.name).to.equal("test");
    //     // await ipfs?.stop();
    //     // await ipfs2?.stop();
    //     await libp2p?.stop();
    //     await libp2p2?.stop();
        
    // });

    afterEach(async () => {
        await libp2p?.stop();
        await libp2p2?.stop();
        await ipfs?.stop();
        await ipfs2?.stop();

    });


});
