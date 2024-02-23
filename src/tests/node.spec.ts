import e from "express";
import { Node, NodeOptions} from "../db/node.js";
import { IPFSOptions } from "../db/setupIPFS.js";
import { OrbitDbOptions } from "../db/setupOrbitDb.js";
import { Component } from "../utils/index.js";

import { expect } from "chai";
import exp from "constants";

describe("Node", () => {
    let node: Node;
    let node2: Node;
    let node3: Node;

    beforeEach(async () => {
        node = new Node({
            type: Component.LIBP2P,
            id: "node1",
        });
        await node.init()
        node2 = new Node({
            type: Component.IPFS,
            id: "node2",
            options: new IPFSOptions({
                libp2p: node.process,
            })
        });
        await node2.init()
        node3 = new Node({
            type: Component.ORBITDB,
            id: "node3",
            options: new OrbitDbOptions({
                ipfs: node2.process,
            })
        });
        await node3.init()
    });

    afterEach( async () => {
        // Clean up any resources if needed
        await node.stop();
        await node2.stop();
        await node3.stop();
    });

    it("should have the correct properties", async () => {
        await node.init()
        expect(node.type).to.be.equal(Component.LIBP2P);
        // expect(node.process.status).to.be.equal("started");
    });

    it("should create a process with valid options", async () => {
        // const options: NodeOptions = { /* provide valid options here */ };
        // await node.createProcess({ options });
        await node.init()
        expect(node.process).to.be.not.null;
    });

    it("should start the process", async () => {
        expect(node.process.status).to.be.equal("started");
        expect(node2.process.libp2p.status).to.be.equal("started");
        expect(node3.process.ipfs.libp2p.status).to.be.equal("started");
    });

});
