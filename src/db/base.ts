import { Libp2p } from "libp2p"
import { Component, LogLevel, ProcessStage, isProcessStage } from "../utils/constants.js"
import { IdReference } from "../utils/id.js"
import { Helia } from "helia"
import { OrbitDb, Database } from "@orbitdb/core"
import { _Libp2pOptions } from "./libp2p.js"
import { _IpfsOptions } from "./ipfs.js"
import { _OrbitDbOptions } from "./orbitDb.js"
import { _OpenDbOptions } from "./open.js"
import { logger } from "../utils/logBook.js"


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

type _ProcessType = Libp2p | Helia | typeof OrbitDb | typeof Database
type _ProcessOptions = _Libp2pOptions | _IpfsOptions | _OrbitDbOptions | _OpenDbOptions

class _BaseProcess {
    public id: IdReference
    public process?: _ProcessType
    public options?: _ProcessOptions

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
            message: `New Base process ready for ${this.id.component}-${this.id.name}`
        })
    }

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

    public checkStatus(update: boolean = true): ProcessStage {
        let stage: ProcessStage = ProcessStage.UNKNOWN;
        try {
            if (!this.process) {
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: `Process not found for ${this.id.component}-${this.id.name}`
                })
                return ProcessStage.ERROR
            }
            const status = this.process.status

            try {
                stage = isProcessStage(status) ? status : ProcessStage.UNKNOWN
            }
            catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: `Error checking process status for ${this.id.component}-${this.id.name}: ${error.message}`,
                    error: error
                })
            }
            if (update) {
                logger({
                    level: LogLevel.INFO,
                    stage: stage,
                    message: `Process status checked for ${this.id.component}: ${stage}`
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

        return stage as ProcessStage
    }

    public async init(): Promise<void> {
        return;
    }

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

    public async restart(): Promise<void> {
        await this.stop()
        await this.start()
    }
}


export {
    _IBaseProcess,
    _BaseProcess
}
