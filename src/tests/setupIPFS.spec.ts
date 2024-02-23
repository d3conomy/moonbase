import { createIPFSProcess, IPFSOptions } from "../db/setupIPFS.js";
import { createLibp2pProcess } from "../db/setupLibp2p.js";
import { Helia } from "helia";

import { expect } from "chai";
import { Libp2p } from "libp2p";

describe("createIPFSProcess", async () => {
    let libp2p: Libp2p
    let libp2p2: Libp2p
    let ipfsProcess: Helia;
    let ipfsProcess2: Helia;

    it("should create an IPFS node with the provided options", async () => {
        // Create a mock libp2p instance
        libp2p = await createLibp2pProcess();

        // Create the options object
        const options: IPFSOptions = new IPFSOptions({
            libp2p,
        });

        // Call the createIPFSProcess function
        const ipfsProcess: Helia = await createIPFSProcess(options);

        // Assert that the IPFS node is created successfully
        expect(ipfsProcess.libp2p.peerId.toString()).to.be.a("string");
        // Add more assertions based on your specific requirements
    });

    it("should create two simultaneous IPFS nodes", async () => {
        // Create a mock libp2p instance
        libp2p = await createLibp2pProcess();
        libp2p2 = await createLibp2pProcess();

        // Create the options object
        const options: IPFSOptions = new IPFSOptions({
            libp2p,
        });

        const options2: IPFSOptions = new IPFSOptions({
            libp2p: libp2p2,
        });

        // Call the createIPFSProcess function
        ipfsProcess = await createIPFSProcess(options);
        ipfsProcess2 = await createIPFSProcess(options2);

        // Assert that the IPFS node is created successfully
        expect(ipfsProcess.libp2p.peerId.toString()).to.be.a("string");
        expect(ipfsProcess2.libp2p.peerId.toString()).to.be.a("string");
        expect(ipfsProcess.libp2p.peerId.toString()).to.not.equal(ipfsProcess2.libp2p.peerId.toString());
        // Add more assertions based on your specific requirements
    });

    after(async () => {
        // Clean up any resources if needed
        await ipfsProcess.libp2p.stop();
        await ipfsProcess2.libp2p.stop();
    });


});
