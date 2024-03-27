import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = ({ id } = {}) => {
    let peerId = undefined;
    if (typeof id === 'string') {
        peerId = peerIdFromString(id);
    }
    else if (id) {
        peerId = peerIdFromPeerId(id);
    }
    else {
        createEd25519PeerId().then((newPeerId) => {
            peerId = newPeerId;
        });
    }
    return peerId;
};
export { libp2pPeerId };
