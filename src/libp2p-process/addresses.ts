import { Multiaddr } from "@multiformats/multiaddr";
 
const setListenAddresses = (
    multiaddrs: Array<Multiaddr>
): { listen: Array<string> } => {
    return {
        listen: multiaddrs.map((addr) => addr.toString())
    }
}

const listenAddresses = ({
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
    additionalMultiaddrs
} : {
    enableTcp?: boolean,
    tcpPort?: number,
    enableIp4?: boolean,
    ip4Domain?: string,
    enableUdp?: boolean,
    udpPort?: number,
    enableIp6?: boolean,
    ip6Domain?: string,
    enableQuicv1?: boolean,
    enableWebTransport?: boolean,
    enableWebSockets?: boolean,
    enableWebRTC?: boolean,
    enableWebRTCStar?: boolean,
    webRTCStarAddress?: Multiaddr | string,
    enableCircuitRelayTransport?: boolean,
    additionalMultiaddrs?: Array<Multiaddr | string>
} = {}): { listen: Array<string> } => {
    let listenAddresses: Array<string> = new Array<string>()

    if (enableIp4) {
        if (enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/tcp/${tcpPort}`)
        }
        if (enableUdp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}`)
        }
        if (enableQuicv1 && enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}/quic-v1`)
        }
        if (enableWebTransport && enableUdp) {
            listenAddresses.push(`/ip4/${ip4Domain}/udp/${udpPort}/quic-v1/webtransport`)
        }
        if (enableWebSockets && enableTcp) {
            listenAddresses.push(`/ip4/${ip4Domain}/tcp/${tcpPort}/ws/`)
        }
    }

    if (enableIp6) {
        if (enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/tcp/${tcpPort}`)
        }
        if (enableUdp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}`)
        }
        if (enableQuicv1 && enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}/quic-v1`)
        }
        if (enableWebTransport && enableUdp) {
            listenAddresses.push(`/ip6/${ip6Domain}/udp/${udpPort}/quic-v1/webtransport`)
        }
        if (enableWebSockets && enableTcp) {
            listenAddresses.push(`/ip6/${ip6Domain}/tcp/${tcpPort}/ws/`)
        }
    }

    if (enableWebRTC) {
        listenAddresses.push('/webrtc')
    }

    // if (enableCircuitRelayTransport) {
    //     listenAddresses.push('/p2p-circuit')
    // }

    if (enableWebRTCStar) {
        if (!webRTCStarAddress) {
            throw new Error('webrtcStarAddress must be provided')
        }
        listenAddresses.push(webRTCStarAddress.toString())
    }

    if (additionalMultiaddrs ? additionalMultiaddrs?.length > 0 : false) {
        additionalMultiaddrs?.forEach((addr: Multiaddr | string) => {
            if (typeof addr === 'string') {
                listenAddresses.push(addr)
            }
            else {
                listenAddresses.push(addr.toString())
            }
        })
    }
    return { listen: listenAddresses }
}


export {
    setListenAddresses,
    listenAddresses as listenAddressesConfig
}