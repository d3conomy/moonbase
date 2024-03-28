import { expect } from "chai";
import { Libp2pOptions } from "libp2p";
import { Libp2pProcessConfig, createLibp2pProcessOptions } from "../src/libp2p-process/processConfig.js";
import { PeerId } from "@libp2p/interface";
import { libp2pPeerId } from "../src/libp2p-process/peerId.js";
import { Libp2pProcessOptions, libp2pProcessOptions } from "../src/libp2p-process/processOptions.js";

describe("Libp2pProcessOptions", async () => {
    describe("constructor", async() => {
        it("should create an instance with default values", async () => {
            const options = new Libp2pProcessOptions();
            await options.init();
            expect(options.processConfig).to.be.an.instanceOf(Libp2pProcessConfig);
            expect(options.peerId).to.be.not.undefined;
        });

        it("should create an instance with provided values", async () => {;
            const processConfig: Libp2pProcessConfig = new Libp2pProcessConfig();
            const peerId: string | PeerId = "QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN";

            const options = await libp2pProcessOptions({
                processConfig,
                peerId
            });

            expect(options.processConfig).to.equal(processConfig);
            expect(options.processOptions).to.equal(options.processOptions);
            expect(options.peerId?.toString()).to.equal(peerId);
        });

        it("should set the peerId in processConfig if provided", async () => {
            const peerId: string | PeerId = "QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN";
            const options = new Libp2pProcessOptions({ peerId });
            await options.init();

            await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for peerId to be set

            expect(options.processConfig?.peerId?.toString()).to.equal(peerId.toString());
        });
    });

    describe("libp2pProcessOptions", async () => {
        it("should create a new instance of Libp2pProcessOptions", async () => {
            const peerId: string | PeerId = "QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN";
            const processConfig: Libp2pProcessConfig = new Libp2pProcessConfig({ peerId });

            const processOptions: Libp2pOptions = await libp2pProcessOptions();

            const options = await libp2pProcessOptions({
                processOptions,
                processConfig,
                peerId
            });

            expect(options).to.be.an.instanceOf(Libp2pProcessOptions);
            expect(options.processConfig).to.equal(processConfig);
            expect(options.processOptions).to.equal(processOptions);
            expect(options.peerId?.toString()).to.equal(peerId);
        });
    });
});
