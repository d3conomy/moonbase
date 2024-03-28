import { Libp2pOptions } from 'libp2p';
import { Multiaddr } from '@multiformats/multiaddr';
import { PeerId } from '@libp2p/interface';
declare class Libp2pProcessConfig {
    autoStart: boolean;
    peerId: PeerId | string | undefined;
    enableTcp: boolean;
    tcpPort: number;
    enableIp4: boolean;
    ip4Domain: string;
    enableUdp: boolean;
    udpPort: number;
    enableIp6: boolean;
    ip6Domain: string;
    enableQuicv1: boolean;
    enableWebTransport: boolean;
    enableWebSockets: boolean;
    enableWebRTC: boolean;
    enableWebRTCStar: boolean;
    webRTCStarAddress: Multiaddr | string;
    enableCircuitRelayTransport: boolean;
    enableNoise: boolean;
    enableBootstrap: boolean;
    defaultBootstrapConfig: boolean;
    bootstrapMultiaddrs: Array<Multiaddr | string>;
    enableMDNS: boolean;
    enableGossipSub: boolean;
    enablePublishToZeroTopicPeers: boolean;
    enableAutoNAT: boolean;
    enableIdentify: boolean;
    enableUPnPNAT: boolean;
    enableDHT: boolean;
    enableDHTClient: boolean;
    enableIpnsValidator: boolean;
    enableIpnsSelector: boolean;
    enableLanDHT: boolean;
    lanDhtProtocol: string;
    lanDhtPeerInfoMapperRemovePublicAddresses: boolean;
    lanDhtClientMode: boolean;
    enableRelay: boolean;
    enableDCUTR: boolean;
    enablePing: boolean;
    enableDenyDialMultiaddr: boolean;
    denyDialMultiaddr: boolean;
    enableYamux: boolean;
    enableMplex: boolean;
}
/**
 * Create a libp2p process configuration
 * @category Libp2p
 * @param options - The libp2p process configuration options
 * @returns The libp2p process configuration
 * @example
 */
declare const createLibp2pProcessOptions: ({ autoStart, peerId, enableTcp, tcpPort, enableIp4, ip4Domain, enableUdp, udpPort, enableIp6, ip6Domain, enableQuicv1, enableWebTransport, enableWebSockets, enableWebRTC, enableWebRTCStar, webRTCStarAddress, enableCircuitRelayTransport, enableNoise, enableBootstrap, bootstrapMultiaddrs, enableMDNS, enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, enableDenyDialMultiaddr, denyDialMultiaddr, enableYamux, enableMplex }?: Libp2pProcessConfig) => Libp2pOptions;
export { createLibp2pProcessOptions, Libp2pProcessConfig };
//# sourceMappingURL=processConfig.d.ts.map