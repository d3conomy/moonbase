import { MemoryDatastore } from "datastore-core";
import { Libp2p } from "libp2p";
import { Helia, createHelia} from "helia";


class IPFSOptions {
    libp2p: Libp2p
    datastore: any
    blockstore: any

    constructor({
        libp2p,
        datastore,
        blockstore
    }: {
        libp2p: Libp2p,
        datastore?: any,
        blockstore?: any
    }) {
        this.libp2p = libp2p
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = blockstore ? datastore : new MemoryDatastore()
    }
}

const createIPFSNode = async (options: IPFSOptions): Promise<Helia> => {
    const helia = await createHelia({
        libp2p: options.libp2p,
        datastore: options.datastore,
        blockstore: options.blockstore
    })
    return helia
}

export {
    IPFSOptions,
    createIPFSNode
}
