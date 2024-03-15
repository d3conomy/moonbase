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
import { peerIdFromString } from '@libp2p/peer-id'
import { ipnsValidator } from 'ipns/validator'
import { ipnsSelector } from 'ipns/selector'
import { mdns } from '@libp2p/mdns'
// import { mplex } from '@libp2p/mplex'
import { Libp2p, Libp2pOptions, createLibp2p } from 'libp2p'
import { Libp2pStatus, PeerId, Connection, Stream } from '@libp2p/interface'
import { IdReference } from '../utils/id.js'
import { Component, LogLevel, logger } from '../utils/index.js'
import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import { _BaseProcess, _IBaseProcess } from './base.js'
import { ProcessStage, isProcessStage } from '../utils/constants.js'


/**
 * Default bootstrap configuration for libp2p
 * @category libp2p
 */
const defaultBootstrapConfig: any = {
    list: [
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    ]
}

/**
 * Default libp2p options
 * @category libp2p
 */
const defaultLibp2pOptions = (): Libp2pOptions => {
    const libp2pOptions: Libp2pOptions = {
        start: false,
        addresses: {
            listen: [
                '/ip4/0.0.0.0/udp/0/',
                '/ip4/0.0.0.0/udp/0/quic-v1',
                '/ip4/0.0.0.0/udp/0/quic-v1/webtransport',
                '/ip4/0.0.0.0/tcp/0/ws/',
                '/ip4/0.0.0.0/tcp/0',
                '/webrtc',
                '/ip6/::/udp/0/',
                '/ip6/::/udp/0/quic-v1',
                '/ip6/::/udp/0/quic-v1/webtransport',
                '/ip6/::/tcp/0/ws/',
                '/ip6/::/tcp/0'
            ],
        },
        transports: [
            webSockets(),
            webTransport(),
            tcp(),
            // webRTC(),
            circuitRelayTransport({
                discoverRelays: 2
            }),
        ],
        connectionEncryption: [
            noise()
        ],
        streamMuxers: [
            yamux(),
            // mplex()
        ],
        services: {
            pubsub: gossipsub({
                allowPublishToZeroTopicPeers: true
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
return libp2pOptions
}

/**
 * Options for creating a libp2p process
 * @category libp2p
 */
class _Libp2pOptions {
    public start: boolean;
    public processOptions: Libp2pOptions

    constructor({
        processOptions,
        start
    }: {
        processOptions?: Libp2pOptions,
        start?: boolean
    } = {}) {
        this.start = start ? start : false
        this.processOptions = processOptions ? processOptions : defaultLibp2pOptions()
        this.processOptions.start = this.start

        logger({
            stage: ProcessStage.NEW,
            level: LogLevel.INFO,
            processId: new IdReference({component: Component.LIBP2P}),
            message: `Libp2p options loaded`,
        })
    }
}

/**
 * Create a libp2p process
 * @category libp2p
 */
const createLibp2pProcess = async (
    options?: _Libp2pOptions
): Promise<Libp2p> => {
    if (!options) {
        options = new _Libp2pOptions({start: false})
    }

    try {
        return await createLibp2p(options.processOptions)
    }
    catch (error: any) {
        logger({
            level: LogLevel.ERROR,
            stage: ProcessStage.ERROR,
            message: `Error creating Libp2p process: ${error.message}`,
            error: error
        })
        throw error
    }
}


/**
 * A class for managing a libp2p process
 * @category libp2p
 */
class Libp2pProcess
    extends _BaseProcess
    implements _IBaseProcess
{
    public declare process?: Libp2p
    public declare options?: _Libp2pOptions

    /**
     * Create a new libp2p process
     */
    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: Libp2p,
        options?: _Libp2pOptions
    } = {}) {
        super({
            id: id,
            component: Component.LIBP2P,
            process: process,
            options: options
        })
    }

    /**
     * Initialize the libp2p process
     */
    public async init(): Promise<void> {
        if (!this.process) {
            try {
                this.process = await createLibp2pProcess(this.options)
            }
            catch {
                const message = `Error initializing process for ${this.id.component}-${this.id.name}`
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                })
                throw new Error(message)
            }
            logger({
                level: LogLevel.INFO,
                stage: ProcessStage.INIT,
                processId: this.id,
                message: `Process initialized for ${this.id.component}-${this.id.name}`
            })
        }
    }

    /**
     * Get the PeerId for the libp2p process
     */
    public peerId(): PeerId {
        let peerId: PeerId;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.component}`)
            }
            peerId = this.process.peerId
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting PeerId for ${this.id.component}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        return peerId
    }

    /**
     * Get the multiaddresses for the libp2p process
     */
    public getMultiaddrs(): Multiaddr[] {
        let multiaddrs: Multiaddr[];
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.component}`)
            }
            multiaddrs = this.process.getMultiaddrs()
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting multiaddrs for ${this.id.component}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        return multiaddrs;
    }

    /**
     * Get the peers for the libp2p process
     */
    public peers(): PeerId[] {
        let peers: PeerId[];
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.component}`)
            }
            peers = this.process.getPeers()
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting peers for ${this.id.component}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        return peers
    }

    /**
     * Get the connections for the libp2p process
     */
    public connections(peerId?: string, max: number = 10): Connection[] {
        if (this.process && peerId) {
            const peerIdObject = peerIdFromString(peerId);
            return this.process.getConnections(peerIdObject);
        }

        const peers = this.process?.getPeers();
        const peerConnections: Connection[] = [];
        let counter = 0;
        peers?.forEach((peer: PeerId) => {
            if (counter >= max) {
                return peerConnections
            }
            
            const connections = this.process?.getConnections(peer);
            if (connections) {
                peerConnections.push(...connections);
                counter += 1;
                logger({
                    level: LogLevel.INFO,
                    message: `Peer: ${peer.toString()} has ${connections.length} connections`
                })
            }

            if (counter >= peers.length) {
                return peerConnections
            }
        })
        return peerConnections
    }

    /**
     * Get the protocols for the libp2p process
     */
    public getProtocols(): string[] {
        let protocols;
        if (!this.process) {
            throw new Error(`No process found for ${this.id.component}`)
        }
        try {
            protocols = this.process.getProtocols()
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting protocols for ${this.id.component}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        return protocols
    }

    /**
     * dial a libp2p address
     */
    public async dial(address: string): Promise<Connection | undefined> {
        let output: Connection | undefined = undefined;
        try {
           output = await this.process?.dial(multiaddr(address))
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error dialing for ${this.id.component}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed but no Connection was return for ${this.id.component}-${this.id.name}: unknown error`
            })
        }
        return output
    }

    /**
     * Dial a libp2p address and protocol
     */ 
    public async dialProtocol(address: string, protocol: string): Promise<Stream | undefined> {
        let output: Stream | undefined = undefined;
        try {
           output = await this.process?.dialProtocol(multiaddr(address), protocol)
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error dialing protocol for ${this.id.component}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed protocol but no Stream was return for ${this.id.component}-${this.id.name}: unknown error`
            })
        }
        return output
    }
}

export {
    defaultLibp2pOptions,
    createLibp2pProcess,
    _Libp2pOptions,
    Libp2pProcess
}