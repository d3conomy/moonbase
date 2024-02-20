import { MemoryDatastore } from "datastore-core";
import { Libp2p } from "libp2p";
import { Helia, createHelia} from "helia";
import { LogLevel, logger } from "../utils/index.js";


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

const createIPFSProcess = async (options: IPFSOptions): Promise<Helia> => {
    let helia: Helia;
    try {
        helia = await createHelia({
            libp2p: options.libp2p,
            datastore: options.datastore,
            blockstore: options.blockstore
        });
    }
    catch (error) {
        logger({
            level: LogLevel.ERROR,
            message: `Error creating IPFS process: ${error}`
        });
        throw error;
    }
    
    // while (helia.libp2p.getConnections().length <= 0) {
    //     setTimeout(() => {
    //         logger({
    //             level: LogLevel.INFO,
    //             message: 'Waiting for libp2p to start...'
    //         });
    //     }, 1000);
    // }

    // helia.start()
    // while (helia.libp2p.status === 'starting') {
    //     await new Promise(resolve => setTimeout(resolve, 1000))
    //     console.log('Waiting for libp2p to start...')
    // }
    return helia
}

export {
    IPFSOptions,
    createIPFSProcess
}
