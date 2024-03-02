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

class _BaseStatus
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




export {
    _IBaseProcess,
    _IBaseStatus,
    _BaseStatus,
}
