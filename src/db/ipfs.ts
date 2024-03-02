import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { Helia, createHelia} from "helia";
import { Component } from "../utils/index.js";
import { Libp2pProcess } from "./libp2p.js";
import { IdReference } from "../utils/id.js";
import { _BaseProcess, _Status, _IBaseProcess } from "./base.js";

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
        this.blockstore = blockstore ? datastore : new MemoryBlockstore()
    }
}

const createIpfsProcess = async (options: _IpfsOptions): Promise<Helia> => {
    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore
    })
}


class IpfsProcess 
    extends _BaseProcess
    implements _IBaseProcess
{
    public process?: Helia
    public options?: _IpfsOptions

    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: Helia
        options?: _IpfsOptions
    }) {
        super({})
        this.id = id ? id : new IdReference({ component: Component.IPFS });
        this.process = process
        this.options = options
    }

    public async init(): Promise<void> {
        if (this.process) {
            return;
        }

        if (!this.options) {
            this.options = new _IpfsOptions({
                libp2p: new Libp2pProcess({})
            })
            
            this.process = await createIpfsProcess(this.options);
        }
    }
}

export {
    createIpfsProcess,
    _IpfsOptions,
    IpfsProcess
}
