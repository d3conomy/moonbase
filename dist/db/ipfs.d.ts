import { Helia } from "helia";
import { CID } from "multiformats";
import { Libp2pProcess } from "./libp2p.js";
import { IdReference } from "../utils/id.js";
import { _BaseProcess, _IBaseProcess } from "./base.js";
/**
 * The options for creating an Ipfs process
 * @category IPFS
 */
declare class _IpfsOptions {
    libp2p: Libp2pProcess;
    datastore: any;
    blockstore: any;
    start: boolean;
    constructor({ libp2p, datastore, blockstore, start, }: {
        libp2p?: Libp2pProcess;
        datastore?: any;
        blockstore?: any;
        start?: boolean;
    });
}
/**
 * Create an IPFS process
 * @category IPFS
 */
declare const createIpfsProcess: (options: _IpfsOptions) => Promise<Helia>;
/**
 * The process container for the IPFS process
 *
 * Helia is used as the IPFS process
 * @category IPFS
 */
declare class IpfsProcess extends _BaseProcess implements _IBaseProcess {
    process?: Helia;
    options?: _IpfsOptions;
    /**
     * Constructor for the Ipfs process
     */
    constructor({ id, process, options }: {
        id?: IdReference;
        process?: Helia;
        options?: _IpfsOptions;
    });
    /**
     * Initialize the IPFS Process
     */
    init(): Promise<void>;
    /**
     * Start the IPFS process
     */
    start(): Promise<void>;
    /**
     * Stop the IPFS process
     */
    stop(): Promise<void>;
    /**
     * Add a JSON object to IPFS
     */
    addJson(data: any): Promise<CID | undefined>;
    /**
     * Get a JSON object from IPFS
     */
    getJson(cid: string): Promise<any | undefined>;
}
export { createIpfsProcess, _IpfsOptions, IpfsProcess };
//# sourceMappingURL=ipfs.d.ts.map