import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { autoNAT } from '@libp2p/autonat'
import { tcp } from '@libp2p/tcp'
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { uPnPNAT } from '@libp2p/upnp-nat'
import { webRTC } from '@libp2p/webrtc'
import { bootstrap } from '@libp2p/bootstrap'
import { ipnsValidator } from 'ipns/validator'
import { ipnsSelector } from 'ipns/selector'
import { mdns } from '@libp2p/mdns'
import { mplex } from '@libp2p/mplex'
import { Libp2p, Libp2pOptions, createLibp2p } from 'libp2p'
import { Libp2pStatus } from '@libp2p/interface'


const defaultBootstrapConfig: any = {
    list: [
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    ]
}

const defaultLibp2pOptions: Libp2pOptions = {
    addresses: {
        listen: [
            '/ip4/0.0.0.0/udp/0/',
            '/ip4/0.0.0.0/udp/0/quic-v1',
            '/ip4/0.0.0.0/udp/0/quic-v1/webtransport',
            '/ip4/0.0.0.0/tcp/0/ws/',
            '/ip4/0.0.0.0/tcp/0',
            '/webrtc',
        ],
    },
    transports: [
        webSockets(),
        webTransport(),
        tcp(),
        webRTC(),
        circuitRelayTransport({
            discoverRelays: 2
        }),
    ],
    connectionEncryption: [
        noise()
    ],
    streamMuxers: [
        yamux(),
        mplex()
    ],
    services: {
        pubsub: gossipsub({
            allowPublishToZeroPeers: true
        }),
        autonat: autoNAT(),
        identify: identify(),
        upnpNAT: uPnPNAT(),
        dht: kadDHT({
            clientMode: false,
            validators: {
                ipns: ipnsValidator
            },
            selectors: {
                ipns: ipnsSelector
            }
        }),
        lanDHT: kadDHT({
            protocol: '/ipfs/lan/kad/1.0.0',
            peerInfoMapper: removePublicAddressesMapper,
            clientMode: false
        }),
        relay: circuitRelayServer({
            advertise: true
        }),
        dcutr: dcutr(),
    },
    peerDiscovery: [
        bootstrap(defaultBootstrapConfig),
        mdns(),
    ],
    connectionGater: {
        denyDialMultiaddr: async () => {
            return false
        }
    }
}

const createLibp2pNode = async (options?: Libp2pOptions): Promise<Libp2p> => {
    const libp2p = await createLibp2p(options ? options: defaultLibp2pOptions)
    return libp2p
}

export {
    defaultLibp2pOptions,
    createLibp2pNode
}