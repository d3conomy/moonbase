import { Libp2p } from "libp2p"
import { Component, LogLevel, ProcessStage, isProcessStage } from "../utils/constants.js"
import { IdReference } from "../utils/id.js"
import { Helia } from "helia"
import { OrbitDb, Database } from "@orbitdb/core"
import { Libp2pProcessOptions } from "./libp2p/index.js"
import { _IpfsOptions } from "./ipfs.js"
import { _OrbitDbOptions } from "./orbitDb.js"
import { _OpenDbOptions } from "./open.js"
import { logger } from "../utils/logBook.js"

/**
 * Interface for process containers
 * @category Process
 */
interface _IBaseProcess {
    id: IdReference
    process?: any
    options?: any

    checkProcess(): boolean
    checkStatus(force?: boolean): ProcessStage
    init(): Promise<void>
    start(): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}

/**
 * Type for process containers
 * @category Process
 */
type _ProcessType = Libp2p | Helia | typeof OrbitDb | typeof Database

/**
 * Type for process options
 * @category Process
 */
type _ProcessOptions = Libp2pProcessOptions | _IpfsOptions | _OrbitDbOptions | _OpenDbOptions

/**
 * Base class for process containers
 * @category Process
 */
class _BaseProcess {
    public id: IdReference
    public process?: _ProcessType
    public options?: _ProcessOptions
    public status: ProcessStage = ProcessStage.UNKNOWN;

    constructor({
        id,
        process,
        options
    }: {
        component?: Component,
        id?: IdReference,
        process?: _ProcessType
        options?: _ProcessOptions
    } = {}) {
        this.id = id ? id : new IdReference({ component: Component.PROCESS });
        this.process = process
        this.options = options
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.NEW,
            message: `Process container ready for init on ${this.id.component}-${this.id.name}`
        })
    }


    /**
     * Check if the process exists
     */
    public checkProcess(): boolean {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Process not found for ${this.id.component}-${this.id.name}`
            })
            return false
        }
        return true
    }

    /**
     * Check the status of the process
     */
    public checkStatus(): ProcessStage {
        let stage: ProcessStage = ProcessStage.UNKNOWN;
        try {
            if (!this.checkProcess()) {
                this.status = ProcessStage.ERROR
                return stage;
            }  

            const status = this.process.status;

            stage = isProcessStage(status)

            if (this.status !== stage) {
                this.status = stage
                logger({
                    level: LogLevel.INFO,
                    stage: stage,
                    processId: this.id,
                    message: `Process status updated for ${this.id.component}-${this.id.name}: ${stage}`
                })
            }
        }
        catch (error: any) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                message: `Error checking process status for ${this.id.component}: ${error.message}`,
                error: error
            })
            throw error
        }

        return stage
    }

    /**
     * Initialize the process
     */
    public async init(): Promise<void> {
        return;
    }

    /**
     * Start the process
     */
    public async start(): Promise<void> {
        if (
            this.process &&
            this.checkStatus() === "stopped"
        ) {
            try {
                await this.process.start()
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: `Error starting process for ${this.id.component}-${this.id.name}: ${error.message}`,
                    error: error
                })
                throw error
            }
            logger(({
                level: LogLevel.INFO,
                stage: ProcessStage.STARTED,
                processId: this.id,
                message: `Process started for ${this.id.component}-${this.id.name}`
            }))
        }
        else if (
            this.process &&
            this.checkStatus() === "starting"
        ) {
            logger({
                level: LogLevel.WARN,
                stage: ProcessStage.WARNING,
                processId: this.id,
                message: `Process already starting for ${this.id.component}-${this.id.name}`
            })
        }
        else {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Process not found for ${this.id.component}-${this.id.name}`
            })
            throw new Error(`Process not found for ${this.id.component}-${this.id.name}`)
        }
    }

    /**
     * Stop the process
     */
    public async stop(): Promise<void> {
        if (
            this.process &&
            this.checkStatus() === "started"
        ){
            try {
                await this.process.stop()
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: `Error stopping process for ${this.id.component}-${this.id.name}: ${error.message}`,
                    error: error
                })
                throw error
            }
            logger({
                level: LogLevel.INFO,
                stage: ProcessStage.STOPPED,
                processId: this.id,
                message: `Process stopped for ${this.id.component}-${this.id.name}`
            })
        }
        else if (
            this.process &&
            this.checkStatus() === "stopping"
        ) {
            logger({
                level: LogLevel.WARN,
                stage: ProcessStage.WARNING,
                processId: this.id,
                message: `Process already stopping for ${this.id.component}-${this.id.name}`
            })
        }
    }

    /**
     * Restart the process
     */
    public async restart(): Promise<void> {
        await this.stop()
        await this.start()
    }
}


export {
    _IBaseProcess,
    _BaseProcess,
    _ProcessType,
    _ProcessOptions
}
