import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
import { PeerId } from '@libp2p/interface';


/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = ({
    id
}: {
    id?: string | PeerId
} = {}): PeerId | undefined => {
    let peerId: PeerId | undefined = undefined;

    if (typeof id === 'string') {
        peerId = peerIdFromString(id)
    }
    else if (id) {
        peerId = peerIdFromPeerId(id)
    }
    else {
        createEd25519PeerId().then((newPeerId: PeerId) => {
            peerId = newPeerId;
        });
    }

    return peerId;
}

export {
    libp2pPeerId
}

