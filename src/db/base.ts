import { IdReference } from "./pod.js"

interface _BaseStatus {
    stage: string
    message?: string
    updated: Date
}


interface _BaseProcess {
    id: IdReference
    process?: any
    options?: any
    status?: _BaseStatus

    checkProcess(): boolean
    checkStatus(): _BaseStatus
    init(): Promise<void>
    start(): Promise<void>
    stop(): Promise<void>
    restart(): Promise<void>
}


export {
    _BaseProcess,
    _BaseStatus
}
