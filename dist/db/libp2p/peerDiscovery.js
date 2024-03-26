import { mdns } from '@libp2p/mdns';
import { libp2pBootstrap } from './bootstrap.js';
/**
 * Default Peer Discover libp2p options
 * @category Libp2p
 */
const peerDiscovery = ({ enableMDNS = false, enableBootstrap = true, bootstrapMultiaddrs = new Array() } = {}) => {
    let peerDiscovery = new Array();
    if (enableBootstrap) {
        peerDiscovery.push(libp2pBootstrap({
            defaultConfig: true,
            multiaddrs: bootstrapMultiaddrs
        }));
    }
    if (enableMDNS) {
        peerDiscovery.push(mdns());
    }
    return peerDiscovery;
};
export { peerDiscovery };
