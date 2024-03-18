import { LunarPod } from "./pod.js";
import { IdReference } from "../utils/id.js";
import { Component, IdReferenceType, ProcessStage } from "../utils/constants.js";
import { OpenDb, OrbitDbTypes } from "./open.js";
import { Multiaddr } from "@multiformats/multiaddr";
/**
 * Represents a collection of LunarPods and provides methods for managing and interacting with them.
 * @category PodBay
*/
declare class PodBay {
    /**
     * The array of LunarPods in the PodBay.
     */
    pods: Array<LunarPod>;
    /**
     * The options for the PodBay.
     */
    options: {
        nameType: IdReferenceType;
    };
    /**
     * Creates a new instance of the PodBay class.
     */
    constructor(options?: {
        nameType: IdReferenceType | string;
        pods?: Array<LunarPod>;
    });
    /**
     * Returns an array of pod IDs in the PodBay.
     */
    podIds(): Array<string>;
    /**
     * Checks if a pod ID exists in the PodBay.
     */
    checkPodId(id?: IdReference): boolean;
    /**
     * Creates a new pod in the PodBay.
     */
    newPod(id?: IdReference, component?: Component): Promise<IdReference | undefined>;
    /**
     * Adds a pod to the PodBay.
     */
    addPod(pod: LunarPod): void;
    /**
     * Gets a pod from the PodBay.
     */
    getPod(id?: IdReference): LunarPod | undefined;
    /**
     * Removes a pod from the PodBay.
     */
    removePod(id: IdReference): Promise<void>;
    /**
     * Gets the status of a pod in the PodBay.
     */
    getStatus(id: IdReference): {
        libp2p?: ProcessStage;
        orbitDb?: ProcessStage;
        ipfs?: ProcessStage;
        db?: Array<ProcessStage>;
    } | undefined;
    /**
     * Gets the names of all open databases in the PodBay.
     */
    getAllOpenDbNames(): Array<string>;
    /**
     * Opens a database in the PodBay.
     */
    openDb({ orbitDbId, dbName, dbType, options }: {
        orbitDbId?: IdReference['name'];
        dbName: string;
        dbType: OrbitDbTypes;
        dialAddress?: string;
        options?: Map<string, string>;
    }): Promise<{
        openDb: OpenDb;
        address?: string;
        podId: IdReference;
        multiaddrs?: Multiaddr[];
    } | undefined>;
    /**
     * Gets the open database with the specified name or ID.
     */
    getOpenDb(dbName: string | IdReference): OpenDb | undefined;
    /**
     * Closes the open database with the specified name or ID.
     */
    closeDb(dbName: string | IdReference): Promise<string | undefined>;
}
export { PodBay, LunarPod };
export * from "./open.js";
export * from "./pod.js";
export * from "./orbitDb.js";
export * from "./ipfs.js";
export * from "./libp2p.js";
export * from "./command.js";
export * from "./base.js";
//# sourceMappingURL=index.d.ts.map