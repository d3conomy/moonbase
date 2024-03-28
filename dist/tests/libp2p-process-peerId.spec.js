import { expect } from 'chai';
import { libp2pPeerId } from '../src/libp2p-process/peerId.js';
describe('libp2pPeerId', async () => {
    it('should create a PeerId from a string', async () => {
        const id = 'QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb';
        const peerId = await libp2pPeerId({ id });
        expect(peerId).to.exist;
        expect(peerId?.toString()).to.equal(id);
    });
    it('should create a PeerId from an existing PeerId', async () => {
        const existingPeerId = await libp2pPeerId();
        const peerId = await libp2pPeerId({ id: existingPeerId });
        expect(peerId).to.exist;
        expect(peerId).to.deep.equal(existingPeerId);
    });
    it('should create a new Ed25519 PeerId if no id is provided', async () => {
        const peerId = await libp2pPeerId();
        expect(peerId).to.exist;
        expect(peerId?.privateKey).to.exist;
        expect(peerId?.publicKey).to.exist;
    });
});
