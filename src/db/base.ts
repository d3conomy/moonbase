import { Component } from "../utils/constants.js"
import { IdReference } from "../utils/id.js"

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

class _BaseProcess {
    public id: IdReference
    public type: Component
    public process?: any
    public options?: any
    public status?: _Status

    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: any,
        options?: any
    }) {
        this.type = Component.PROCESS
        this.id = id ? id : new IdReference({ component: this.type });
        this.process = process
        this.options = options
    }

    public checkProcess(): boolean {
        return this.process ? true : false
    }

    public checkStatus(force?: boolean): _Status {
        if (force || !this.status) {
            this.status = new _Status({stage: this.process?.status , message: `${this.type} process status checked`})
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
