import { createLibp2p } from 'libp2p';
import { multiaddr } from '@multiformats/multiaddr';
import { peerIdFromString } from '@libp2p/peer-id';
import { LogLevel, ProcessStage, isProcessStage, logger } from 'd3-artifacts';
import { Libp2pProcessOptions } from './processOptions.js';
/**
 * Create a libp2p process
 * @category Libp2p
 */
const createLibp2pProcess = async (options) => {
    if (!options) {
        options = new Libp2pProcessOptions();
    }
    try {
        return await createLibp2p(options.processOptions);
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            stage: ProcessStage.ERROR,
            message: `Error creating Libp2p process: ${error.message}`,
            error: error
        });
        throw error;
    }
};
/**
 * A class for managing a libp2p process
 * @category Libp2p
 */
class Libp2pProcess {
    /**
     * Create a new libp2p process
     */
    constructor({ id, process, options }) {
        this.id = id;
        this.process = process;
        this.options = options;
    }
    /**
     * Check if a process exists
     */
    checkProcess() {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `No process found for ${this.id.podId.name}`
            });
            return false;
        }
        return true;
    }
    /**
     * Initialize the libp2p process
     */
    async init() {
        if (!this.checkProcess()) {
            try {
                this.process = await createLibp2pProcess(this.options);
            }
            catch {
                const message = `Error initializing process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                throw new Error(message);
            }
            logger({
                level: LogLevel.INFO,
                stage: ProcessStage.INIT,
                processId: this.id,
                message: `Process initialized for ${this.id.podId.name}-${this.id.name}`
            });
        }
    }
    status() {
        const updatedStatus = this.process?.status;
        return updatedStatus ? isProcessStage(updatedStatus) : ProcessStage.UNKNOWN;
    }
    /**
     * Start the libp2p process
     */
    async start() {
        if (this.checkProcess() &&
            this.status() !== ProcessStage.STARTED &&
            this.status() !== ProcessStage.STARTING) {
            try {
                await this.process?.start();
            }
            catch {
                const message = `Error starting process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                throw new Error(message);
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.STARTING,
            processId: this.id,
            message: `Process started for ${this.id.podId.name}-${this.id.name}`
        });
    }
    /**
     * Stop the libp2p process
     */
    async stop() {
        if (this.checkProcess() &&
            this.status() !== ProcessStage.STOPPED &&
            this.status() !== ProcessStage.STOPPING) {
            try {
                await this.process?.stop();
            }
            catch {
                const message = `Error stopping process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                throw new Error(message);
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.STOPPING,
            processId: this.id,
            message: `Process stopped for ${this.id.podId.name}-${this.id.name}`
        });
    }
    /**
     * Restart the libp2p process
     */
    async restart() {
        if (this.checkProcess()) {
            try {
                await this.stop();
                await this.start();
            }
            catch {
                const message = `Error restarting process for ${this.id.name}`;
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: message
                });
                throw new Error(message);
            }
        }
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.RESTARTING,
            processId: this.id,
            message: `Process restarted for ${this.id.podId.name}-${this.id.name}`
        });
    }
    /**
     * Get the PeerId for the libp2p process
     */
    peerId() {
        let peerId;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            peerId = this.process.peerId;
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting PeerId for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return peerId;
    }
    /**
     * Get the multiaddresses for the libp2p process
     */
    getMultiaddrs() {
        let multiaddrs;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            multiaddrs = this.process.getMultiaddrs();
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting multiaddrs for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return multiaddrs;
    }
    /**
     * Get the peers for the libp2p process
     */
    peers() {
        let peers;
        try {
            if (!this.process) {
                throw new Error(`No process found for ${this.id.podId.name}`);
            }
            peers = this.process.getPeers();
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting peers for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return peers;
    }
    /**
     * Get the connections for the libp2p process
     */
    connections(peerId, max = 10) {
        if (this.process && peerId) {
            const peerIdObject = peerIdFromString(peerId);
            return this.process.getConnections(peerIdObject);
        }
        const peers = this.process?.getPeers();
        const peerConnections = [];
        let counter = 0;
        peers?.forEach((peer) => {
            if (counter >= max) {
                return peerConnections;
            }
            const connections = this.process?.getConnections(peer);
            if (connections) {
                peerConnections.push(...connections);
                counter += 1;
                logger({
                    level: LogLevel.INFO,
                    message: `Peer: ${peer.toString()} has ${connections.length} connections`
                });
            }
            if (counter >= peers.length) {
                return peerConnections;
            }
        });
        return peerConnections;
    }
    /**
     * Get the protocols for the libp2p process
     */
    getProtocols() {
        let protocols;
        if (!this.process) {
            throw new Error(`No process found for ${this.id.podId.name}`);
        }
        try {
            protocols = this.process.getProtocols();
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error getting protocols for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return protocols;
    }
    /**
     * dial a libp2p address
     */
    async dial(address) {
        let output = undefined;
        try {
            output = await this.process?.dial(multiaddr(address));
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error dialing for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed but no Connection was return for ${this.id.podId.name}-${this.id.name}: unknown error`
            });
        }
        return output;
    }
    /**
     * Dial a libp2p address and protocol
     */
    async dialProtocol(address, protocol) {
        let output = undefined;
        try {
            output = await this.process?.dialProtocol(multiaddr(address), protocol);
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Error dialing protocol for ${this.id.podId.name}-${this.id.name}: ${error.message}`,
                error: error
            });
            throw error;
        }
        if (!output) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Dialed protocol but no Stream was return for ${this.id.podId.name}-${this.id.name}: unknown error`
            });
        }
        return output;
    }
}
export { createLibp2pProcess, Libp2pProcess };
