import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { createHelia } from "helia";
import { dagJson } from "@helia/dag-json";
import { CID } from "multiformats";
import { Component, LogLevel, ProcessStage, logger } from "../utils/index.js";
import { _BaseProcess } from "./base.js";
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class _IpfsOptions {
    libp2p;
    datastore;
    blockstore;
    start;
    constructor({ libp2p, datastore, blockstore, start, }) {
        if (!libp2p) {
            throw new Error(`No Libp2p process found`);
        }
        this.libp2p = libp2p;
        this.datastore = datastore ? datastore : new MemoryDatastore();
        this.blockstore = blockstore ? datastore : new MemoryBlockstore();
        this.start = start ? start : false;
    }
}
/**
 * Create an IPFS process
 * @category IPFS
 */
const createIpfsProcess = async (options) => {
    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore,
        start: options.start
    });
};
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsProcess extends _BaseProcess {
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, process, options }) {
        super({
            id: id,
            component: Component.IPFS,
            process: process,
            options: options
        });
    }
    /**
     * Initialize the IPFS Process
     */
    async init() {
        if (this.process !== undefined) {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Ipfs process already exists`
            });
            return;
        }
        if (!this.options) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Ipfs options found`
            });
            throw new Error(`No Ipfs options found`);
        }
        if (!this.options.libp2p) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Libp2p process found`
            });
            throw new Error(`No Libp2p process found`);
        }
        try {
            this.process = await createIpfsProcess(this.options);
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `Error creating Ipfs process: ${error.message}`,
                error: error
            });
            throw error;
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Ipfs process created and initialized`,
            stage: ProcessStage.INIT
        });
    }
    /**
     * Start the IPFS process
     */
    async start() {
        if (this.checkProcess()) {
            try {
                await this.process?.start();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process started`,
                    stage: ProcessStage.STARTED
                });
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error starting Ipfs process: ${error.message}`,
                    error: error
                });
                throw error;
            }
        }
    }
    /**
     * Stop the IPFS process
     */
    async stop() {
        if (this.checkProcess()) {
            try {
                await this.process?.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process stopped`,
                    stage: ProcessStage.STOPPED
                });
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping Ipfs process: ${error.message}`,
                    error: error
                });
                throw error;
            }
        }
    }
    /**
     * Add a JSON object to IPFS
     */
    async addJson(data) {
        let cid = undefined;
        if (this.checkProcess()) {
            try {
                const dj = dagJson(this.process);
                cid = await dj.add(data);
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error adding JSON to Ipfs: ${error.message}`,
                    error: error
                });
                throw error;
            }
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Added JSON to Ipfs: ${cid}`
        });
        return cid;
    }
    /**
     * Get a JSON object from IPFS
     */
    async getJson(cid) {
        let result;
        if (this.process) {
            try {
                const dj = dagJson(this.process);
                result = await dj.get(CID.parse(cid));
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error getting JSON from Ipfs: ${error.message}`,
                    error: error
                });
                throw error;
            }
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Got JSON from Ipfs: ${JSON.stringify(result)}`
        });
        return result;
    }
}
export { createIpfsProcess, _IpfsOptions, IpfsProcess };
