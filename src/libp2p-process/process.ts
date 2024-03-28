import { PeerId, Connection, Stream } from '@libp2p/interface'

import { Libp2p, createLibp2p } from 'libp2p'

import { Multiaddr, multiaddr } from '@multiformats/multiaddr'
import { peerIdFromString } from '@libp2p/peer-id'


import { IProcess, IdReference, LogLevel, PodProcessId, ProcessStage, isProcessStage, logger } from 'd3-artifacts'
import { Libp2pProcessOptions } from './processOptions.js'


/**
 * Create a libp2p process
 * @category Libp2p
 */
const createLibp2pProcess = async (
    options?: Libp2pProcessOptions
): Promise<Libp2p> => {
    if (!options) {
        options = new Libp2pProcessOptions()
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
 * @category Libp2p
 */
class Libp2pProcess
    implements IProcess
{
    public declare id: PodProcessId
    public declare process?: Libp2p
    public declare options?: Libp2pProcessOptions

    /**
     * Create a new libp2p process
     */
    constructor({
        id,
        process,
        options
    }: {
        id: PodProcessId,
        process?: Libp2p,
        options?: Libp2pProcessOptions
    }) {
        this.id = id
        this.process = process
        this.options = options
    }

    /**
     * Check if a process exists
     */
    public checkProcess(): boolean {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `No process found for ${this.id.podId.name}`
            })
            return false
        }
        return true
    }

    /**
     * Initialize the libp2p process
     */
    public async init(): Promise<void> {
        if (!this.checkProcess()) {
            try {
                this.process = await createLibp2pProcess(this.options)
            }
            catch {
                const message = `Error initializing process for ${this.id.name}`
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
                message: `Process initialized for ${this.id.podId.name}-${this.id.name}`
            })
        }
    }


    public status(): ProcessStage {
        
        const updatedStatus = this.process?.status
        return updatedStatus ? isProcessStage(updatedStatus) : ProcessStage.UNKNOWN
    }

    /**
     * Start the libp2p process
     */
    public async start(): Promise<void> {
        if (
            this.checkProcess() &&
            this.status() !== ProcessStage.STARTED &&
            this.status() !== ProcessStage.STARTING
        ) {
            try {
                await this.process?.start()
            }
            catch {
                const message = `Error starting process for ${this.id.name}`
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                })
                throw new Error(message)
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.STARTING,
            processId: this.id,
            message: `Process started for ${this.id.podId.name}-${this.id.name}`
        })
    }

    /**
     * Stop the libp2p process
     */
    public async stop(): Promise<void> {
        if (
            this.checkProcess() &&
            this.status() !== ProcessStage.STOPPED &&
            this.status() !== ProcessStage.STOPPING
        ) {
            try {
                await this.process?.stop()
            }
            catch {
                const message = `Error stopping process for ${this.id.name}`
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                })
                throw new Error(message)
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.STOPPING,
            processId: this.id,
            message: `Process stopped for ${this.id.podId.name}-${this.id.name}`
        })
    }

    /**
     * Restart the libp2p process
     */
    public async restart(): Promise<void> {
        if (this.checkProcess()) {
            try {
                await this.stop()
                await this.start()
            }
            catch {
                const message = `Error restarting process for ${this.id.name}`
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                })
                throw new Error(message)
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.RESTARTING,
            processId: this.id,
            message: `Process restarted for ${this.id.podId.name}-${this.id.name}`
        })
    }

    /**
     * Get the PeerId for the libp2p process
     */
    public peerId(): PeerId {
        let peerId: PeerId;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`)
            }
            peerId = this.process.peerId
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting PeerId for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
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
                throw new Error(`No process found for ${this.id.podId.name}`)
            }
            multiaddrs = this.process.getMultiaddrs()
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting multiaddrs for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
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
                throw new Error(`No process found for ${this.id.podId.name}`)
            }
            peers = this.process.getPeers()
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting peers for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
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
            throw new Error(`No process found for ${this.id.podId.name}`)
        }
        try {
            protocols = this.process.getProtocols()
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting protocols for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
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
                message: `Error dialing for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed but no Connection was return for ${this.id.podId.name}-${this.id.name}: unknown error`
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
                message: `Error dialing protocol for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            })
            throw error
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed protocol but no Stream was return for ${this.id.podId.name}-${this.id.name}: unknown error`
            })
        }
        return output
    }
}

export {
    createLibp2pProcess,
    Libp2pProcess
}