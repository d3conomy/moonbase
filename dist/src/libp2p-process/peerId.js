import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = async ({ id } = {}) => {
    let peerId;
    if (typeof id === 'string') {
        peerId = peerIdFromString(id);
    }
    else if (id) {
        peerId = peerIdFromPeerId(id);
    }
    else {
        peerId = await createEd25519PeerId();
    }
    return peerId;
};
export { libp2pPeerId };
