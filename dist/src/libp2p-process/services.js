import { circuitRelayServer } from '@libp2p/circuit-relay-v2';
import { dcutr } from '@libp2p/dcutr';
import { identify } from '@libp2p/identify';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { autoNAT } from '@libp2p/autonat';
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht';
import { uPnPNAT } from '@libp2p/upnp-nat';
import { ipnsValidator } from 'ipns/validator';
import { ipnsSelector } from 'ipns/selector';
import { ping } from '@libp2p/ping';
/**
 * Default libp2p options
 * @category Libp2p
 */
const services = ({ enableGossipSub, enablePublishToZeroTopicPeers, enableAutoNAT, enableIdentify, enableUPnPNAT, enableDHT, enableDHTClient, enableIpnsValidator, enableIpnsSelector, enableLanDHT, lanDhtProtocol, lanDhtPeerInfoMapperRemovePublicAddresses, lanDhtClientMode, enableRelay, enableDCUTR, enablePing, } = {}) => {
    let serviceOptions = new Map();
    if (enableGossipSub) {
        serviceOptions.set('pubsub', gossipsub({
            allowPublishToZeroTopicPeers: enablePublishToZeroTopicPeers
        }));
    }
    if (enableAutoNAT) {
        serviceOptions.set('autonat', autoNAT());
    }
    if (enableIdentify) {
        serviceOptions.set('identify', identify());
    }
    if (enableUPnPNAT) {
        serviceOptions.set('upnpNAT', uPnPNAT());
    }
    if (enableDHT) {
        let dhtConfig = new Map();
        if (enableDHTClient) {
            dhtConfig.set('clientMode', true);
        }
        if (enableIpnsValidator || enableIpnsSelector) {
            if (enableIpnsValidator && enableIpnsSelector) {
                dhtConfig.set('validators', { ipns: ipnsValidator });
                dhtConfig.set('selectors', { ipns: ipnsSelector });
            }
            if (enableIpnsValidator && !enableIpnsSelector) {
                dhtConfig.set('validators', { ipns: ipnsValidator });
            }
            if (!enableIpnsValidator && enableIpnsSelector) {
                dhtConfig.set('selectors', { ipns: ipnsSelector });
            }
            serviceOptions.set('dht', kadDHT(dhtConfig));
        }
    }
    if (enableLanDHT) {
        let lanDhtConfig = new Map();
        if (lanDhtProtocol) {
            lanDhtConfig.set('protocol', lanDhtProtocol);
        }
        if (lanDhtPeerInfoMapperRemovePublicAddresses) {
            lanDhtConfig.set('peerInfoMapper', removePublicAddressesMapper);
        }
        if (lanDhtClientMode) {
            lanDhtConfig.set('clientMode', true);
        }
        serviceOptions.set('lanDHT', kadDHT(lanDhtConfig));
    }
    if (enableRelay) {
        serviceOptions.set('relay', circuitRelayServer({
            advertise: true
        }));
    }
    if (enableDCUTR) {
        serviceOptions.set('dcutr', dcutr());
    }
    if (enablePing) {
        serviceOptions.set('ping', ping());
    }
    return serviceOptions;
};
export { services as libp2pServices };
