/// <reference path="../../src/typings.d.ts" />
import { Libp2p } from "libp2p";
import { Component, ProcessStage } from "../utils/constants.js";
import { IdReference } from "../utils/id.js";
import { Helia } from "helia";
import { OrbitDb, Database } from "@orbitdb/core";
import { Libp2pProcessOptions } from "./libp2p/index.js";
import { _IpfsOptions } from "./ipfs.js";
import { _OrbitDbOptions } from "./orbitDb.js";
import { _OpenDbOptions } from "./open.js";
/**
 * Interface for process containers
 * @category Process
 */
interface _IBaseProcess {
    id: IdReference;
    process?: any;
    options?: any;
    checkProcess(): boolean;
    checkStatus(force?: boolean): ProcessStage;
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    restart(): Promise<void>;
}
/**
 * Type for process containers
 * @category Process
 */
type _ProcessType = Libp2p | Helia | typeof OrbitDb | typeof Database;
/**
 * Type for process options
 * @category Process
 */
type _ProcessOptions = Libp2pProcessOptions | _IpfsOptions | _OrbitDbOptions | _OpenDbOptions;
/**
 * Base class for process containers
 * @category Process
 */
declare class _BaseProcess {
    id: IdReference;
    process?: _ProcessType;
    options?: _ProcessOptions;
    status: ProcessStage;
    constructor({ component, id, process, options }?: {
        component?: Component;
        id?: IdReference;
        process?: _ProcessType;
        options?: _ProcessOptions;
    });
    /**
     * Check if the process exists
     */
    checkProcess(): boolean;
    /**
     * Check the status of the process
     */
    checkStatus(): ProcessStage;
    /**
     * Initialize the process
     */
    init(): Promise<void>;
    /**
     * Start the process
     */
    start(): Promise<void>;
    /**
     * Stop the process
     */
    stop(): Promise<void>;
    /**
     * Restart the process
     */
    restart(): Promise<void>;
}
export { _IBaseProcess, _BaseProcess, _ProcessType, _ProcessOptions };
//# sourceMappingURL=base.d.ts.map