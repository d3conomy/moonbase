import { Node, NodeOptions} from "../db/node.js";
import { Component } from "../utils/index.js";

import { expect } from "chai";

describe("Node", () => {
    let node: Node;
    let node2: Node;
    let node3: Node;

    beforeEach(() => {
        node = new Node({
            type: Component.LIBP2P,
            id: "node1",
        });
        // node2 = new Node({
        //     type: Component.IPFS,
        //     id: "node2",
        // });
        // node3 = new Node({
        //     type: Component.ORBITDB,
        //     id: "node3",
        // });
    });

    afterEach( async () => {
        // Clean up any resources if needed
        await node.stop();
    });

    it("should have the correct properties", () => {
        // expect(node.id).to.be.instanceOf(String);
        expect(node.type).to.be.equal(Component.LIBP2P);
        // expect(node.process.status).to.be.equal("started");
    });

    it("should create a process with valid options", async () => {
        const options: NodeOptions = { /* provide valid options here */ };
        await node.createProcess({ options });
        expect(node.process).to.be.not.null;
    });

    it("should stop the process", async () => {
        const options: NodeOptions = { /* provide valid options here */ };
        await node.createProcess({ options });
        expect(node.process).to.be.not.null;
        await node.stop();
        // expect(node.process.status).to.be.equal("stopping");
    });
});
