import { transports } from './transports.js';
import { listenAddressesConfig } from './addresses.js';
import { libp2pServices } from './services.js';
import { streamMuxers } from './streamMuxers.js';
import { peerDiscovery } from './peerDiscovery.js';
import { connectionEncryption } from './connectionEncryption.js';
import { connectionGater } from './connectionGater.js';
import { libp2pPeerId } from './peerId.js';
class Libp2pProcessConfig {
    autoStart = false;
    peerId = undefined;
    enableTcp = true;
    tcpPort = 0;
    enableIp4 = true;
    ip4Domain = '0.0.0.0';
    enableUdp = true;
    udpPort = 0;
    enableIp6 = true;
    ip6Domain = '::';
    enableQuicv1 = true;
    enableWebTransport = true;
    enableWebSockets = true;
    enableWebRTC = true;
    enableWebRTCStar = true;
    webRTCStarAddress = '/dns4/webrtc-star.trnk.xyz/tcp/443/wss/p2p-webrtc-star';
    enableCircuitRelayTransport = true;
    enableNoise = true;
    enableBootstrap = true;
    defaultBootstrapConfig = true;
    bootstrapMultiaddrs = new Array();
    enableMDNS = false;
    enableGossipSub = true;
    enablePublishToZeroTopicPeers = true;
    enableAutoNAT = true;
    enableIdentify = true;
    enableUPnPNAT = true;
    enableDHT = true;
    enableDHTClient = true;
    enableIpnsValidator = true;
    enableIpnsSelector = true;
    enableLanDHT = true;
    lanDhtProtocol = '/ipfs/lan/kad/1.0.0';
    lanDhtPeerInfoMapperRemovePublicAddresses = true;
    lanDhtClientMode = false;
    enableRelay = true;
    enableDCUTR = true;
    enablePing = true;
    enableDenyDialMultiaddr = true;
    denyDialMultiaddr = false;
    enableYamux = true;
    enableMplex = false;
}
/**
 * Create a libp2p process configuration
 * @category Libp2p
 * @param options - The libp2p process configuration options
 * @returns The libp2p process configuration
 * @example
 */
const createLibp2pProcessOptions = ({ autoStart, peerId, enableTcp, tcpPort, enableIp4, ip4Domain, enableUdp, udpPort, enableIp6, ip6Domain, enableQuicv1, enableWebTransport, enableWebSockets, enableWebRTC, enableWebRTCStar, webRTCStarAddress, enableCircuitRelayTransport, enableNoise, enableBootstrap, bootstrapMultiaddrs, enableMDNS, enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, enableDenyDialMultiaddr, denyDialMultiaddr, enableYamux, enableMplex } = new Libp2pProcessConfig()) => {
    let options = {
        start: autoStart,
        addresses: listenAddressesConfig({
            enableTcp,
            tcpPort,
            enableIp4,
            ip4Domain,
            enableUdp,
            udpPort,
            enableIp6,
            ip6Domain,
            enableQuicv1,
            enableWebTransport,
            enableWebSockets,
            enableWebRTC,
            enableWebRTCStar,
            webRTCStarAddress,
            enableCircuitRelayTransport,
        }),
        transports: transports({
            enableWebSockets,
            enableWebTransport,
            enableTcp,
            enableWebRTC,
            enableCircuitRelayTransport
        }),
        connectionEncryption: connectionEncryption({
            enableNoise
        }),
        streamMuxers: streamMuxers({
            enableYamux,
            enableMplex
        }),
        services: libp2pServices({
            enableGossipSub,
            enablePublishToZeroTopicPeers,
            enableAutoNAT,
            enableIdentify,
            enableUPnPNAT,
            enableDHT,
            enableDHTClient,
            enableIpnsValidator,
            enableIpnsSelector,
            enableLanDHT,
            lanDhtProtocol,
            lanDhtPeerInfoMapperRemovePublicAddresses,
            lanDhtClientMode,
            enableRelay,
            enableDCUTR,
            enablePing
        }),
        peerDiscovery: peerDiscovery({
            enableMDNS,
            enableBootstrap,
            bootstrapMultiaddrs
        }),
        connectionGater: connectionGater({
            enableDenyDialMultiaddr,
            denyDialMultiaddr
        }),
    };
    if (peerId) {
        options.peerId = libp2pPeerId({ id: peerId });
    }
    return options;
};
export { createLibp2pProcessOptions, Libp2pProcessConfig };
