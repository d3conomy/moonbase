import { MemoryDatastore } from "datastore-core";
import { Libp2p } from "libp2p";
import { Helia, createHelia} from "helia";
import { Component, LogLevel, logger } from "../utils/index.js";
import { Libp2pProcess, createLibp2pProcess } from "./setupLibp2p.js";
import { IdReference } from "../moonbase.js";


class IpfsOptions {
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

const createIpfsProcess = async (options?: IpfsOptions): Promise<Helia> => {
    if (!options) {
        options = new IpfsOptions({
            libp2p: new Libp2pProcess({})
        })
    }

    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore
    })
    // let helia: Helia;
    // try {
    //     if (!libp2pProcess) {
    //         logger({
    //             level: LogLevel.INFO,
    //             message: `No libp2p process provided to create IPFS process, defaulting to libp2p process created by IPFS.`
    //         });
    //         libp2pProcess = new Libp2pProcess({});
    //         await libp2pProcess.init();
    //     }
    //     helia = await createHelia({
    //         libp2p: libp2pProcess.libp2p,
    //         datastore: datastore ? datastore : new MemoryDatastore(),
    //         blockstore: blockstore ? blockstore : new MemoryDatastore() 
    //     });

    //     await helia.start();
    // }
    // catch (error) {
    //     logger({
    //         level: LogLevel.ERROR,
    //         message: `Error creating IPFS process: ${error}`
    //     });
    //     throw error;
    // }

    // return helia

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
    public options?: IpfsOptions
    public status?: _IpfsStatus

    constructor({
        id,
        helia,
        options
    }: {
        id?: IdReference,
        helia?: Helia
        options?: IpfsOptions
    }) {
        this.id = id ? id : new IdReference({ component: Component.IPFS});
        this.process = helia
        this.options = options
    }

    public async init(): Promise<void> {
        if (!this.options) {
            this.options = new IpfsOptions({
                libp2p: new Libp2pProcess({})
            })
        }

        if (!this.process) {
            this.process = await createIpfsProcess(this.options);
        }
    }
}

export {
    IpfsOptions,
    createIpfsProcess,
    _IpfsStatus,
    IpfsProcess
}
