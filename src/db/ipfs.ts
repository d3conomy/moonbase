import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { Helia, createHelia} from "helia";
import { dagJson } from "@helia/dag-json";
import { dagCbor } from "@helia/dag-cbor";
import { CID } from "multiformats";
import { Component, LogLevel, ProcessStage, logger } from "../utils/index.js";
import { Libp2pProcess } from "./libp2p.js";
import { IdReference } from "../utils/id.js";
import { _BaseProcess, _IBaseProcess } from "./base.js";


/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
class _IpfsOptions {
    libp2p: Libp2pProcess
    datastore: any
    blockstore: any
    start: boolean


    constructor({
        libp2p,
        datastore,
        blockstore,
        start,
    }: {
        libp2p?: Libp2pProcess,
        datastore?: any,
        blockstore?: any,
        start?: boolean
    }) {
        if (!libp2p) {
            throw new Error(`No Libp2p process found`)
        }
        this.libp2p = libp2p 
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = blockstore ? datastore : new MemoryBlockstore()
        this.start = start ? start : false
    }
}

/**
 * Create an IPFS process
 * @category IPFS
 */
const createIpfsProcess = async (options: _IpfsOptions): Promise<Helia> => {
    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore,
        start: options.start
    })
}


/**
 * The process container for the IPFS process
 * 
 * Helia is used as the IPFS process
 * @category IPFS
 */
class IpfsProcess 
    extends _BaseProcess
    implements _IBaseProcess
{
    public declare process?: Helia
    public declare options?: _IpfsOptions

    /**
     * Constructor for the Ipfs process
     */
    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: Helia
        options?: _IpfsOptions
    }) {
        super({
            id: id,
            component: Component.IPFS,
            process: process,
            options: options as _IpfsOptions
        })
    }

    /**
     * Initialize the IPFS Process
     */
    public async init(): Promise<void> {
        if (this.process !== undefined) {
            logger({
                level: LogLevel.WARN,
                processId: this.id,
                message: `Ipfs process already exists`
            })
            return;
        }

        if (!this.options) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Ipfs options found`
            })
            throw new Error(`No Ipfs options found`)
        }
        
        if (!this.options.libp2p) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `No Libp2p process found`
            })
            throw new Error(`No Libp2p process found`)
        }

        try {
            this.process = await createIpfsProcess(this.options)
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `Error creating Ipfs process: ${error.message}`,
                error: error
            })
            throw error
        }
        logger({
            level: LogLevel.INFO,
            processId: this.id,
            message: `Ipfs process created and initialized`,
            stage: ProcessStage.INIT
        })
    }

    /**
     * Start the IPFS process
     */
    public async start(): Promise<void> {
        if (this.checkProcess()) {
            try {
                await this.process?.start()
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process started`,
                    stage: ProcessStage.STARTED
                })
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error starting Ipfs process: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
    }

    /**
     * Stop the IPFS process
     */
    public async stop(): Promise<void> {
        if (this.checkProcess()) {
            try {
                await this.process?.stop()
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `Ipfs process stopped`,
                    stage: ProcessStage.STOPPED
                })
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping Ipfs process: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
    }

    /**
     * Add a JSON object to IPFS
     */
    public async addJson(data: any): Promise<CID | undefined> {
        let cid: CID | undefined = undefined
        if (this.checkProcess()) {
            try {
                const dj = dagJson(this.process as Helia)
                cid = await dj.add(data);
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error adding JSON to Ipfs: ${error.message}`,
                    error: error
                })
                throw error
            }
        }
        return cid
    }

    /**
     * Get a JSON object from IPFS
     */
    public async getJson(cid: string): Promise<any | Error | undefined> {
        let result: any
        if (this.process) {
            try {
                const dj = dagJson(this.process)
                result = await dj.get(CID.parse(cid));
            }
            catch (err: any) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error getting JSON from Ipfs: ${err.message}`,
                    error: err
                })
                throw err
            }
        }
        return result
    }
}

export {
    createIpfsProcess,
    _IpfsOptions,
    IpfsProcess
}
