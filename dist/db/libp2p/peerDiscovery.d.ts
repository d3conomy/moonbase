import { Multiaddr } from '@multiformats/multiaddr';
/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
declare const peerDiscovery: ({ enableMDNS, enableBootstrap, bootstrapMultiaddrs }?: {
    enableMDNS?: boolean | undefined;
    enableBootstrap?: boolean | undefined;
    bootstrapMultiaddrs?: (string | Multiaddr)[] | undefined;
}) => any[];
export { peerDiscovery };
//# sourceMappingURL=peerDiscovery.d.ts.map