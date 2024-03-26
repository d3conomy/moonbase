import { PeerId, Connection, Stream } from '@libp2p/interface';
import { Libp2p } from 'libp2p';
import { IdReference } from '../../utils/id.js';
import { _BaseProcess, _IBaseProcess } from '../base.js';
import { Multiaddr } from '@multiformats/multiaddr';
import { Libp2pProcessOptions } from './processOptions.js';
/**
 * Create a libp2p process
 * @category Libp2p
 */
declare const createLibp2pProcess: (options?: Libp2pProcessOptions) => Promise<Libp2p>;
/**
 * A class for managing a libp2p process
 * @category Libp2p
 */
declare class Libp2pProcess extends _BaseProcess implements _IBaseProcess {
    process?: Libp2p;
    options?: Libp2pProcessOptions;
    /**
     * Create a new libp2p process
     */
    constructor({ id, process, options }?: {
        id?: IdReference;
        process?: Libp2p;
        options?: Libp2pProcessOptions;
    });
    /**
     * Initialize the libp2p process
     */
    init(): Promise<void>;
    /**
     * Get the PeerId for the libp2p process
     */
    peerId(): PeerId;
    /**
     * Get the multiaddresses for the libp2p process
     */
    getMultiaddrs(): Multiaddr[];
    /**
     * Get the peers for the libp2p process
     */
    peers(): PeerId[];
    /**
     * Get the connections for the libp2p process
     */
    connections(peerId?: string, max?: number): Connection[];
    /**
     * Get the protocols for the libp2p process
     */
    getProtocols(): string[];
    /**
     * dial a libp2p address
     */
    dial(address: string): Promise<Connection | undefined>;
    /**
     * Dial a libp2p address and protocol
     */
    dialProtocol(address: string, protocol: string): Promise<Stream | undefined>;
}
export { createLibp2pProcess, Libp2pProcess };
//# sourceMappingURL=process.d.ts.map