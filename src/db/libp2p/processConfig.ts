import { Libp2pOptions } from 'libp2p'
import { libp2pBootstrap } from './bootstrap.js'
import { transports } from './transports.js'
import { listenAddressesConfig } from './addresses.js'
import { libp2pServices } from './services.js'
import { streamMuxers } from './streamMuxers.js'
import { peerDiscovery } from './peerDiscovery.js'
import { connectionEncryption } from './connectionEncryption.js'
import { connectionGater } from './connectionGater.js'
import { Multiaddr } from '@multiformats/multiaddr'
import { PeerId } from '@libp2p/interface'
import { libp2pPeerId } from './peerId.js'


class Libp2pProcessConfig {
        autoStart: boolean = false;
        peerId: PeerId | string | undefined = undefined;
        enableTcp: boolean = true;
        tcpPort: number = 0;
        enableIp4: boolean = true;
        ip4Domain: string = '0.0.0.0';
        enableUdp: boolean = true;
        udpPort: number = 0;
        enableIp6: boolean = true;
        ip6Domain: string = '::';
        enableQuicv1: boolean = true;
        enableWebTransport: boolean = true;
        enableWebSockets: boolean = true;
        enableWebRTC: boolean = true;
        enableWebRTCStar: boolean = true;
        webRTCStarAddress: Multiaddr | string = '/dns4/webrtc-star.trnk.xyz/tcp/443/wss/p2p-webrtc-star';
        enableCircuitRelayTransport: boolean = true;
        enableNoise: boolean = true;
        enableBootstrap: boolean = true;
        defaultBootstrapConfig: boolean = true;
        bootstrapMultiaddrs: Array<Multiaddr | string> = new Array<Multiaddr | string>();
        enableMDNS: boolean = false;
        enableGossipSub: boolean = true;
        enablePublishToZeroTopicPeers: boolean = true;
        enableAutoNAT: boolean = true;
        enableIdentify: boolean = true;
        enableUPnPNAT: boolean = true;
        enableDHT: boolean = true;
        enableDHTClient: boolean = true;
        enableIpnsValidator: boolean = true;
        enableIpnsSelector: boolean = true;
        enableLanDHT: boolean = true;
        lanDhtProtocol: string = '/ipfs/lan/kad/1.0.0';
        lanDhtPeerInfoMapperRemovePublicAddresses: boolean = true;
        lanDhtClientMode: boolean = false;
        enableRelay: boolean = true;
        enableDCUTR: boolean = true;
        enablePing: boolean = true;
        enableDenyDialMultiaddr: boolean = true;
        denyDialMultiaddr: boolean = false;
        enableYamux: boolean = true;
        enableMplex: boolean = false;
}


/**
 * Create a libp2p process configuration
 * @category Libp2p
 * @param options - The libp2p process configuration options
 * @returns The libp2p process configuration
 * @example
 */
const createLibp2pProcessOptions = ({
    autoStart,
    peerId,
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
    enableNoise,
    enableBootstrap,
    bootstrapMultiaddrs,
    enableMDNS,
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
    enablePing,
    enableDenyDialMultiaddr,
    denyDialMultiaddr,
    enableYamux,
    enableMplex
}: Libp2pProcessConfig = 
    new Libp2pProcessConfig()
): Libp2pOptions => {
    let options: Libp2pOptions = {
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
    }
    
    if (peerId) {
        options.peerId = libp2pPeerId({id: peerId})
    }

    return options
}

export {
    createLibp2pProcessOptions,
    Libp2pProcessConfig
}