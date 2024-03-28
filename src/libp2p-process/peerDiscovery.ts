import { mdns } from '@libp2p/mdns'
import { Multiaddr } from '@multiformats/multiaddr'

import { libp2pBootstrap } from './bootstrap.js'


/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
const peerDiscovery = ({
    enableMDNS = false,
    enableBootstrap = true,
    useDefaultBootstrap = false,
    bootstrapMultiaddrs = new Array<string | Multiaddr>()
}: {
    enableMDNS?: boolean,
    enableBootstrap?: boolean,
    useDefaultBootstrap?: boolean,
    bootstrapMultiaddrs?: Array<string | Multiaddr>
} = {}) => {
    let peerDiscovery: Array<any> = new Array<any>();
    if (enableBootstrap && (useDefaultBootstrap || bootstrapMultiaddrs.length > 0)) {
        peerDiscovery.push(libp2pBootstrap({
            defaultConfig: useDefaultBootstrap,
            multiaddrs: bootstrapMultiaddrs
        }))
    }
    if (enableMDNS) {
        peerDiscovery.push(mdns())
    }
    return peerDiscovery;
}

export {
    peerDiscovery
}