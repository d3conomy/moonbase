import { LunarPod } from "./pod.js";
import { IdReference } from "../utils/id.js";
import { logger } from "../utils/logBook.js";
import { Component, LogLevel, isIdReferenceType } from "../utils/constants.js";
/**
 * Represents a collection of LunarPods and provides methods for managing and interacting with them.
 * @category PodBay
*/
class PodBay {
    /**
     * The array of LunarPods in the PodBay.
     */
    pods;
    /**
     * The options for the PodBay.
     */
    options;
    /**
     * Creates a new instance of the PodBay class.
     */
    constructor(options) {
        this.pods = options?.pods ? options.pods : new Array();
        this.options = {
            nameType: isIdReferenceType(options?.nameType)
        };
    }
    /**
     * Returns an array of pod IDs in the PodBay.
     */
    podIds() {
        return this.pods.map(pod => pod.id.getId());
    }
    /**
     * Checks if a pod ID exists in the PodBay.
     */
    checkPodId(id) {
        if (!id) {
            throw new Error('IdReference is undefined');
        }
        return this.podIds().includes(id.getId());
    }
    /**
     * Creates a new pod in the PodBay.
     */
    async newPod(id, component) {
        if (!id) {
            id = new IdReference({ component: Component.POD, type: this.options.nameType });
        }
        if (id && !this.checkPodId(id)) {
            let pod = new LunarPod({ id });
            if (component) {
                await pod.init(component);
            }
            this.addPod(pod);
            return pod.id;
        }
        else {
            logger({
                level: LogLevel.ERROR,
                message: `Pod with id ${id.getId()} already exists`
            });
        }
    }
    /**
     * Adds a pod to the PodBay.
     */
    addPod(pod) {
        if (!this.checkPodId(pod.id)) {
            this.pods.push(pod);
        }
        else {
            throw new Error(`Pod with id ${pod.id.getId()} already exists`);
        }
    }
    /**
     * Gets a pod from the PodBay.
     */
    getPod(id) {
        if (!id) {
            logger({
                level: LogLevel.ERROR,
                message: `IdReference is undefined`
            });
        }
        else {
            const pod = this.pods.find(pod => pod.id.getId() === id.getId());
            if (pod) {
                if (pod.id.component === Component.POD) {
                    return pod;
                }
            }
            else {
                logger({
                    level: LogLevel.ERROR,
                    message: `Pod with id ${id.getId()} not found`
                });
            }
        }
    }
    /**
     * Removes a pod from the PodBay.
     */
    async removePod(id) {
        const pod = this.getPod(id);
        if (pod) {
            if (pod.db.size > 0) {
                pod.db.forEach(async (db, key) => {
                    await pod.stopOpenDb(key);
                });
            }
            await pod.stop();
            const index = this.pods.indexOf(pod);
            this.pods.splice(index, 1);
            logger({
                level: LogLevel.INFO,
                message: `Pod with id ${id.getId()} removed`
            });
        }
        else {
            logger({
                level: LogLevel.ERROR,
                message: `Pod with id ${id.getId()} not found`
            });
        }
    }
    /**
     * Gets the status of a pod in the PodBay.
     */
    getStatus(id) {
        const pod = this.getPod(id);
        if (pod) {
            return pod.status();
        }
    }
    /**
     * Gets the names of all open databases in the PodBay.
     */
    getAllOpenDbNames() {
        const dbNames = [];
        this.pods.forEach(pod => {
            pod.db.forEach(db => {
                dbNames.push(db.id.getId());
            });
        });
        return dbNames;
    }
    /**
     * Opens a database in the PodBay.
     */
    async openDb({ orbitDbId, dbName, dbType, options }) {
        //get a pod with an orbitDbProcess
        let orbitDbPod;
        let openDbOptions;
        let openDb;
        if (this.getOpenDb(dbName)) {
            logger({
                level: LogLevel.INFO,
                message: `Database ${dbName} already opened`
            });
            const opened = this.getOpenDb(dbName);
            if (opened !== undefined) {
                return {
                    openDb: opened,
                    address: opened?.address(),
                    podId: opened?.id,
                };
            }
        }
        if (orbitDbId) {
            orbitDbPod = this.pods.find(pod => {
                logger({
                    level: LogLevel.INFO,
                    message: `Checking pod ${pod.id.name} for orbitDb`
                });
                if (pod.orbitDb &&
                    pod.id.name === orbitDbId &&
                    pod.db.size > 0) {
                    openDb = pod.getOpenDb(dbName);
                    return {
                        openDb,
                        type: openDb?.options?.databaseType,
                        address: openDb?.address(),
                        multiaddrs: pod.libp2p?.getMultiaddrs(),
                    };
                }
            });
        }
        else {
            orbitDbPod = this.pods.find(pod => pod.db.size === 0);
        }
        if (!orbitDbPod ||
            !orbitDbPod.orbitDb ||
            orbitDbPod?.db?.size > 0) {
            const podId = await this.newPod(new IdReference({ component: Component.POD, type: this.options.nameType }), Component.ORBITDB);
            orbitDbPod = this.getPod(podId);
            logger({
                level: LogLevel.INFO,
                message: `New pod ${podId?.getId()} created for orbitDb`
            });
        }
        if (orbitDbPod && orbitDbPod.orbitDb) {
            openDbOptions = {
                databaseName: dbName,
                databaseType: dbType,
                options: options ? options : new Map()
            };
            try {
                openDb = await orbitDbPod?.initOpenDb(openDbOptions);
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
                await this.closeDb(openDbOptions.databaseName);
                await this.removePod(orbitDbPod.id);
                return;
            }
            if (openDb) {
                return {
                    openDb,
                    address: openDb.address(),
                    podId: orbitDbPod.id,
                    multiaddrs: orbitDbPod.libp2p?.getMultiaddrs()
                };
            }
        }
    }
    /**
     * Gets the open database with the specified name or ID.
     */
    getOpenDb(dbName) {
        let orbitDbId;
        if (dbName instanceof IdReference) {
            orbitDbId = dbName.getId();
        }
        else {
            orbitDbId = dbName;
        }
        //return the open db
        const orbitDbPod = this.pods.find(pod => {
            if (pod.db.has(orbitDbId)) {
                return pod.db.get(orbitDbId);
            }
        });
        if (orbitDbPod) {
            return orbitDbPod.db.get(orbitDbId);
        }
    }
    /**
     * Closes the open database with the specified name or ID.
     */
    async closeDb(dbName) {
        let orbitDbId;
        if (dbName instanceof IdReference) {
            orbitDbId = dbName.getId();
        }
        else {
            orbitDbId = dbName;
        }
        //close the open db
        const orbitDbPod = this.pods.find(pod => {
            if (pod.db.has(orbitDbId)) {
                return pod;
            }
        });
        if (orbitDbPod) {
            await orbitDbPod.stopOpenDb(orbitDbId);
            this.removePod(orbitDbPod.id);
            return orbitDbId;
        }
    }
}
export { PodBay, LunarPod };
export * from "./open.js";
export * from "./pod.js";
export * from "./orbitDb.js";
export * from "./ipfs.js";
export * from "./libp2p.js";
export * from "./command.js";
export * from "./base.js";
