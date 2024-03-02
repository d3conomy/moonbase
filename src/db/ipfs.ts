import { MemoryDatastore } from "datastore-core";
import { Helia, createHelia} from "helia";
import { Component } from "../utils/index.js";
import { Libp2pProcess } from "./libp2p.js";
import { IdReference } from "./pod.js";


class _IpfsOptions {
    libp2p: Libp2pProcess
    datastore: any
    blockstore: any

    constructor({
        libp2p,
        datastore,
        blockstore
    }: {
        libp2p: Libp2pProcess,
        datastore?: any,
        blockstore?: any
    }) {
        this.libp2p = libp2p
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = blockstore ? datastore : new MemoryDatastore()
    }
}

const createIpfsProcess = async (options: _IpfsOptions): Promise<Helia> => {
    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore
    })
}

class _IpfsStatus {
    public status?: string
    public message?: string
    public updated?: Date

    constructor({
        status,
        message
    }: {
        status?: string,
        message?: string,
    }) {
        this.status = status
        this.message = message
        this.updated = new Date()
    }

    public update({
        status,
        message,
    }: {
        status?: string,
        message?: string,
    }): void {
        this.status = status
        this.message = message
        this.updated = new Date()
    }
}


class IpfsProcess {
    public id: IdReference;
    public process?: Helia
    public options: _IpfsOptions
    public status?: _IpfsStatus

    constructor({
        id,
        helia,
        options
    }: {
        id?: IdReference,
        helia?: Helia
        options: _IpfsOptions
    }) {
        this.id = id ? id : new IdReference({ component: Component.IPFS});
        this.process = helia
        this.options = options
    }

    public async init(): Promise<void> {
        if (!this.process) {
            this.process = await createIpfsProcess(this.options);
        }
    }
}

export {
    createIpfsProcess,
    _IpfsOptions,
    _IpfsStatus,
    IpfsProcess
}
