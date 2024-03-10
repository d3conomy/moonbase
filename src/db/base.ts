import { Libp2p } from "libp2p"
import { Component } from "../utils/constants.js"
import { IdReference } from "../utils/id.js"
import { Helia } from "helia"
import { OrbitDb, Database } from "@orbitdb/core"
import { _Libp2pOptions } from "./libp2p.js"
import { _IpfsOptions } from "./ipfs.js"
import { _OrbitDbOptions } from "./orbitDb.js"
import { _OpenDbOptions } from "./open.js"

interface _IBaseStatus {
    stage: string
    message?: string
    updated: Date

    update({
        stage,
        message
    }: {
        stage?: string,
        message?: string
    }): void
}

class _Status
    implements _IBaseStatus
{
    public stage: string
    public message?: string
    public updated: Date = new Date()

    constructor({
        stage,
        message
    }: {
        stage?: string,
        message?: string,
    }) {
        this.stage = stage ? stage : "init"
        this.message = message
        this.updated = new Date()
    }

    public update({
        stage,
        message,
    }: {
        stage?: string,
        message?: string,
    }): void {
        this.stage = stage ? stage : this.stage
        this.message = message
        this.updated = new Date()
    }
}

interface _IBaseProcess {
    id: IdReference
    process?: any
    options?: any
    status?: _IBaseStatus

    checkProcess(): boolean
    checkStatus(force?: boolean): _IBaseStatus
    init(): Promise<void>
    start(): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}

type _ProcessType = Libp2p | Helia | typeof OrbitDb | typeof Database
type _ProcessOptions = _Libp2pOptions | _IpfsOptions | _OrbitDbOptions | _OpenDbOptions

class _BaseProcess {
    public id: IdReference
    public component: Component
    public process?: _ProcessType
    public options?: _ProcessOptions
    public status?: _Status

    constructor({
        component,
        id,
        process,
        options
    }: {
        component?: Component,
        id?: IdReference,
        process?: _ProcessType
        options?: _ProcessOptions
    } = {}) {
        this.component = component ? component : Component.PROCESS
        this.id = id ? id : new IdReference({ component: this.component });
        this.process = process
        this.options = options
    }

    public checkProcess(): boolean {
        return this.process ? true : false
    }

    public checkStatus(update: boolean = true): _Status {
        if (update || !this.status) {
            this.status = new _Status({
                stage: this.process?.status,
                message: `${this.id.component} process status checked`
            })
        }
        return this.status
    }

    public async init(): Promise<void> {
        return;
    }

    public async start(): Promise<void> {
        if (this.process) {
            await this.process.start()
            this.status?.update({stage: this.process.status})
        }
    }

    public async stop(): Promise<void> {
        if (this.process) {
            await this.process.stop()
            this.status?.update({stage: this.process.status})
        }
    }

    public async restart(): Promise<void> {
        await this.stop()
        await this.init()
        await this.start()
    }

}


export {
    _IBaseProcess,
    _IBaseStatus,
    _Status,
    _BaseProcess
}
