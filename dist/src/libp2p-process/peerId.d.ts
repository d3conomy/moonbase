import { PeerId } from '@libp2p/interface';
/**
 * Create a PeerId
 * @category Libp2p
 */
declare const libp2pPeerId: ({ id }?: {
    id?: string | PeerId | undefined;
}) => Promise<PeerId | undefined>;
export { libp2pPeerId };
//# sourceMappingURL=peerId.d.ts.map