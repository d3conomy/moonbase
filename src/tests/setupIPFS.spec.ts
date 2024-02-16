import { createIPFSProcess, IPFSOptions } from "../db/setupIPFS.js";
import { createLibp2pProcess } from "../db/setupLibp2p.js";
import { Helia } from "helia";

import { expect } from "chai";

describe("createIPFSProcess", async () => {
    it("should create an IPFS node with the provided options", async () => {
        // Create a mock libp2p instance
        const mockLibp2p = await createLibp2pProcess();

        // Create the options object
        const options: IPFSOptions = new IPFSOptions({
            libp2p: mockLibp2p,
        });

        // Call the createIPFSProcess function
        const ipfsProcess: Helia = await createIPFSProcess(options);

        // Assert that the IPFS node is created successfully
        expect(ipfsProcess.libp2p.peerId.toString()).to.be.a("string");
        // Add more assertions based on your specific requirements
    });
});
