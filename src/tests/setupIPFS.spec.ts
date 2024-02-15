import { createIPFSNode, IPFSOptions } from "../db/setupIPFS.js";
import { createLibp2p, Libp2p } from "libp2p";
import { MemoryDatastore } from "datastore-core";
import { createLibp2pNode } from "../db/setupLibp2p.js";
import { Helia } from "helia";

import { expect } from "chai";

describe("createIPFSNode", async () => {
    it("should create an IPFS node with the provided options", async () => {
        // Create a mock libp2p instance
        const mockLibp2p = await createLibp2pNode();

        // Create the options object
        const options: IPFSOptions = new IPFSOptions({
            libp2p: mockLibp2p,
        });

        // Call the createIPFSNode function
        const ipfsNode = await createIPFSNode(options);

        // Assert that the IPFS node is created successfully
        expect(ipfsNode.libp2p.peerId.toString()).to.be.a("string");
        // Add more assertions based on your specific requirements
    });
});
