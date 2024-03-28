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
    constructor({ autoStart, peerId, enableTcp, tcpPort, enableIp4, ip4Domain, enableUdp, udpPort, enableIp6, ip6Domain, enableQuicv1, enableWebTransport, enableWebSockets, enableWebRTC, enableWebRTCStar, webRTCStarAddress, enableCircuitRelayTransport, enableNoise, enableBootstrap, bootstrapMultiaddrs, enableMDNS, enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, enableDenyDialMultiaddr, denyDialMultiaddr, enableYamux, enableMplex } = {}) {
        this.autoStart = autoStart ? autoStart : this.autoStart;
        this.peerId = peerId ? peerId : this.peerId;
        this.enableTcp = enableTcp ? enableTcp : this.enableTcp;
        this.tcpPort = tcpPort ? tcpPort : this.tcpPort;
        this.enableIp4 = enableIp4 ? enableIp4 : this.enableIp4;
        this.ip4Domain = ip4Domain ? ip4Domain : this.ip4Domain;
        this.enableUdp = enableUdp ? enableUdp : this.enableUdp;
        this.udpPort = udpPort ? udpPort : this.udpPort;
        this.enableIp6 = enableIp6 ? enableIp6 : this.enableIp6;
        this.ip6Domain = ip6Domain ? ip6Domain : this.ip6Domain;
        this.enableQuicv1 = enableQuicv1 ? enableQuicv1 : this.enableQuicv1;
        this.enableWebTransport = enableWebTransport ? enableWebTransport : this.enableWebTransport;
        this.enableWebSockets = enableWebSockets ? enableWebSockets : this.enableWebSockets;
        this.enableWebRTC = enableWebRTC ? enableWebRTC : this.enableWebRTC;
        this.enableWebRTCStar = enableWebRTCStar ? enableWebRTCStar : this.enableWebRTCStar;
        this.webRTCStarAddress = webRTCStarAddress ? webRTCStarAddress : this.webRTCStarAddress;
        this.enableCircuitRelayTransport = enableCircuitRelayTransport ? enableCircuitRelayTransport : this.enableCircuitRelayTransport;
        this.enableNoise = enableNoise ? enableNoise : this.enableNoise;
        this.enableBootstrap = enableBootstrap ? enableBootstrap : this.enableBootstrap;
        this.bootstrapMultiaddrs = bootstrapMultiaddrs ? bootstrapMultiaddrs : this.bootstrapMultiaddrs;
        this.enableMDNS = enableMDNS ? enableMDNS : this.enableMDNS;
        this.enableGossipSub = enableGossipSub ? enableGossipSub : this.enableGossipSub;
        this.enablePublishToZeroTopicPeers = enablePublishToZeroTopicPeers ? enablePublishToZeroTopicPeers : this.enablePublishToZeroTopicPeers;
        this.enableAutoNAT = enableAutoNAT ? enableAutoNAT : this.enableAutoNAT;
        this.enableIdentify = enableIdentify ? enableIdentify : this.enableIdentify;
        this.enableUPnPNAT = enableUPnPNAT ? enableUPnPNAT : this.enableUPnPNAT;
        this.enableDHT = enableDHT ? enableDHT : this.enableDHT;
        this.enableDHTClient = enableDHTClient ? enableDHTClient : this.enableDHTClient;
        this.enableIpnsValidator = enableIpnsValidator ? enableIpnsValidator : this.enableIpnsValidator;
        this.enableIpnsSelector = enableIpnsSelector ? enableIpnsSelector : this.enableIpnsSelector;
        this.enableLanDHT = enableLanDHT ? enableLanDHT : this.enableLanDHT;
        this.lanDhtProtocol = lanDhtProtocol ? lanDhtProtocol : this.lanDhtProtocol;
        this.lanDhtPeerInfoMapperRemovePublicAddresses = lanDhtPeerInfoMapperRemovePublicAddresses ? lanDhtPeerInfoMapperRemovePublicAddresses : this.lanDhtPeerInfoMapperRemovePublicAddresses;
        this.lanDhtClientMode = lanDhtClientMode ? lanDhtClientMode : this.lanDhtClientMode;
        this.enableRelay = enableRelay ? enableRelay : this.enableRelay;
        this.enableDCUTR = enableDCUTR ? enableDCUTR : this.enableDCUTR;
        this.enablePing = enablePing ? enablePing : this.enablePing;
        this.enableDenyDialMultiaddr = enableDenyDialMultiaddr ? enableDenyDialMultiaddr : this.enableDenyDialMultiaddr;
        this.denyDialMultiaddr = denyDialMultiaddr ? denyDialMultiaddr : this.denyDialMultiaddr;
        this.enableYamux = enableYamux ? enableYamux : this.enableYamux;
        this.enableMplex = enableMplex ? enableMplex : this.enableMplex;
    }
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
        libp2pPeerId({ id: peerId }).then((peerId) => {
            options.peerId = peerId;
        });
    }
    return options;
};
export { createLibp2pProcessOptions, Libp2pProcessConfig };
