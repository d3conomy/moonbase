import { execute, operation } from "../db/command.js";
import { LunarPod, PodBay } from "../db/index.js";
import { expect } from "chai";
import { Component, IdReference } from "../utils/index.js";

describe("Command Tests", () => {
    let podBay: PodBay;
    let pod: IdReference | undefined;

    beforeEach( async () => {
        podBay = new PodBay();
        pod = await podBay.newPod(new IdReference({ component: Component.POD }), Component.LIBP2P);
    });

    it("should execute a command", async () => {
        const testPod = podBay.getPod(pod)
        if (testPod) {
            const result = await execute({
                pod: testPod,
                command: "connections",
            });
            expect(result).to.be.not.null;
        }
    });
});