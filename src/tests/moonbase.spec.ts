import { IdReference, LunarPod } from "../moonbase.js";
import { Component, LogLevel, logger } from "../utils/index.js";
import { expect } from "chai";

describe('Moonbase', () => {
    let peer: LunarPod | null = null;

    beforeEach(() => {
        peer = null;
        peer = new LunarPod({
            id: new IdReference({
                component: Component.LIBP2P
            })
        });
    });

    afterEach(async () => {
        await peer?.libp2p?.stop();
        peer = null;
    })

    it('should create a peer', async () => {
        await peer?.initLibp2p({});
        expect(peer).to.be.not.null;
        expect(peer?.id).to.be.not.null;
        expect(peer?.libp2p).to.be.not.null;
        expect(peer?.ipfs).to.be.undefined;
        expect(peer?.orbitDb).to.be.undefined;
        expect(peer?.db).to.be.undefined;

        logger({
            level: LogLevel.INFO,
            message: `Peer id: ${peer?.libp2p?.peerId()}`
        })
    })
})