
import { bootstrap } from '@libp2p/bootstrap'
import { mdns } from '@libp2p/mdns'
import { libp2pBootstrap } from './bootstrap.js'
import { Multiaddr } from '@multiformats/multiaddr'



/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
const peerDiscovery = ({
    enableMDNS = false,
    enableBootstrap = true,
    bootstrapMultiaddrs = new Array<string | Multiaddr>()
}: {
    enableMDNS?: boolean,
    enableBootstrap?: boolean,
    bootstrapMultiaddrs?: Array<string | Multiaddr>
} = {}) => {
    let peerDiscovery: Array<any> = new Array<any>();
    if (enableBootstrap) {
        peerDiscovery.push(libp2pBootstrap({
            defaultConfig: true,
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