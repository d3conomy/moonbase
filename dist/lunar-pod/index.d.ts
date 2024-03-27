import { Libp2pProcess, Libp2pProcessOptions } from "../libp2p-process/index.js";
import { _IpfsOptions, IpfsProcess } from "./ipfs.js";
import { ProcessStage } from "../utils/constants.js";
import { IdReference } from "../utils/id.js";
import { OrbitDbProcess, _OrbitDbOptions } from "./orbitDb.js";
import { OpenDb } from "./open.js";
/**
 * Represents a LunarPod, which is a container for managing various components and databases.
 * @category Pod
*/
declare class LunarPod {
    id: IdReference;
    libp2p?: Libp2pProcess;
    ipfs?: IpfsProcess;
    orbitDb?: OrbitDbProcess;
    db: Map<string, OpenDb>;
    /**
     * Construct a new Lunar Pod that is ready for initialization.
     */
    constructor({ id, libp2p, ipfs, orbitDb, }?: {
        id?: IdReference;
        libp2p?: Libp2pProcess;
        ipfs?: IpfsProcess;
        orbitDb?: OrbitDbProcess;
    });
    /**
     * Get the components and their statuses for this pod.
     */
    getComponents(): Array<{
        id: IdReference;
        status: ProcessStage;
    }>;
    /**
     * Initialize all components and databases in the pod.
     */
    private initAll;
    /**
     * Initialize a specific component or all components in the pod.
     */
    init(component?: string): Promise<void>;
    /**
     * Start the Libp2p process in the pod.
     */
    initLibp2p({ libp2pOptions }?: {
        libp2pOptions?: Libp2pProcessOptions;
    }): Promise<void>;
    /**
     * Start the IPFS process in the pod.
     */
    initIpfs({ ipfsOptions }?: {
        ipfsOptions?: _IpfsOptions;
    }): Promise<void>;
    /**
     * Start the OrbitDb process in the pod.
     */
    initOrbitDb({ orbitDbOptions }?: {
        orbitDbOptions?: _OrbitDbOptions;
    }): Promise<void>;
    /**
     * Start the OrbitDb process in the pod.
     */
    initOpenDb({ databaseName, databaseType, options }?: {
        databaseName?: string;
        databaseType?: string;
        options?: Map<string, string>;
    }): Promise<OpenDb | undefined>;
    /**
     * Get the OrbitDb process in the pod.
     */
    getOpenDb(orbitDbName: string): OpenDb | undefined;
    /**
     * Get all Open Databases in the pod.
     */
    getAllOpenDbs(): Map<string, OpenDb>;
    /**
     * Get the names of all Open Databases in the pod.
     */
    getDbNames(): Array<string>;
    /**
     * Start a component or all components in the pod.
     */
    start(component?: string): Promise<void>;
    /**
     * Stop a specific open database in the pod.
     */
    stopOpenDb(orbitDbName: string): Promise<void>;
    /**
     * Stop specific components or all components in the pod.
     */
    stop(component?: string): Promise<void>;
    /**
     * Restart specific components or all components in the pod.
     */
    restart(component?: string): Promise<void>;
    /**
     * Get the status of all components and databases in the pod.
     */
    status(): {
        libp2p?: ProcessStage;
        ipfs?: ProcessStage;
        orbitdb?: ProcessStage;
        db?: Array<ProcessStage>;
    };
}
export { LunarPod };
//# sourceMappingURL=index.d.ts.map