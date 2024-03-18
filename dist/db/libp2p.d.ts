import { Libp2p, Libp2pOptions } from 'libp2p';
import { PeerId, Connection, Stream } from '@libp2p/interface';
import { IdReference } from '../utils/id.js';
import { Multiaddr } from '@multiformats/multiaddr';
import { _BaseProcess, _IBaseProcess } from './base.js';
/**
 * Default libp2p options
 * @category Libp2p
 */
declare const defaultLibp2pOptions: () => Libp2pOptions;
/**
 * Options for creating a libp2p process
 * @category Libp2p
 */
declare class _Libp2pOptions {
    start: boolean;
    processOptions: Libp2pOptions;
    constructor({ processOptions, start }?: {
        processOptions?: Libp2pOptions;
        start?: boolean;
    });
}
/**
 * Create a libp2p process
 * @category Libp2p
 */
declare const createLibp2pProcess: (options?: _Libp2pOptions) => Promise<Libp2p>;
/**
 * A class for managing a libp2p process
 * @category Libp2p
 */
declare class Libp2pProcess extends _BaseProcess implements _IBaseProcess {
    process?: Libp2p;
    options?: _Libp2pOptions;
    /**
     * Create a new libp2p process
     */
    constructor({ id, process, options }?: {
        id?: IdReference;
        process?: Libp2p;
        options?: _Libp2pOptions;
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
export { defaultLibp2pOptions, createLibp2pProcess, _Libp2pOptions, Libp2pProcess };
//# sourceMappingURL=libp2p.d.ts.map