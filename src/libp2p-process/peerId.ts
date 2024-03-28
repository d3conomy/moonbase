import { createEd25519PeerId } from '@libp2p/peer-id-factory';
import { peerIdFromString, peerIdFromPeerId } from '@libp2p/peer-id';
import { PeerId } from '@libp2p/interface';


/**
 * Create a PeerId
 * @category Libp2p
 */
const libp2pPeerId = async ({
    id
}: {
    id?: string | PeerId
} = {}): Promise<PeerId | undefined> => {
    let peerId: PeerId;

    if (typeof id === 'string') {
        peerId = peerIdFromString(id)
    }
    else if (id) {
        peerId = peerIdFromPeerId(id)
    }
    else {
        peerId = await createEd25519PeerId()
    }

    return peerId;
}

export {
    libp2pPeerId
}

