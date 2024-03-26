import { LunarPod } from "./pod.js";
import { IdReference } from "../utils/id.js";
import { logger } from "../utils/logBook.js";
import { Component, IdReferenceType, LogLevel, ProcessStage, isIdReferenceType } from "../utils/constants.js";
import { OpenDb, OrbitDbTypes, _OpenDbOptions } from "./open.js";
import { Multiaddr } from "@multiformats/multiaddr";


/**
 * Represents a collection of LunarPods and provides methods for managing and interacting with them.
 * @category PodBay 
*/
class PodBay {
    /**
     * The array of LunarPods in the PodBay.
     */
    public pods: Array<LunarPod>;

    /**
     * The options for the PodBay.
     */
    public options: {
        nameType: IdReferenceType
    };

    /**
     * Creates a new instance of the PodBay class.
     */
    constructor(options?: {
        nameType: IdReferenceType | string,
        pods?: Array<LunarPod>, 
    }) {
        this.pods = options?.pods ? options.pods : new Array<LunarPod>();
        this.options = {
            nameType: isIdReferenceType(options?.nameType)
        };
    }

    /**
     * Returns an array of pod IDs in the PodBay.
     */
    public podIds(): Array<string> {
        return this.pods.map(pod => pod.id.getId());
    }

    /**
     * Checks if a pod ID exists in the PodBay.
     */
    public checkPodId(id?: IdReference): boolean {
        if (!id) {
            throw new Error('IdReference is undefined');
        }

        return this.podIds().includes(id.getId());
    }

    /**
     * Creates a new pod in the PodBay.
     */
    public async newPod(id?: IdReference, component?: Component): Promise<IdReference | undefined> {
        if (!id) {
            id = new IdReference({ component: Component.POD, type: this.options.nameType });
        }
        if (id && !this.checkPodId(id)) {

            let pod = new LunarPod({id});
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
    public addPod(pod: LunarPod): void {
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
    public getPod(id?: IdReference): LunarPod | undefined {
        if (!id) {
            logger({
                level: LogLevel.ERROR,
                message: `IdReference is undefined`
            })
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
    public async removePod(id: IdReference): Promise<void> {
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
    public getStatus(id: IdReference): {
        libp2p?: ProcessStage,
        orbitDb?: ProcessStage,
        ipfs?: ProcessStage,
        db?: Array<ProcessStage>
    } | undefined{
        const pod = this.getPod(id);
        if (pod) {
            return pod.status();
        }
    }

    /**
     * Gets the names of all open databases in the PodBay.
     */
    public getAllOpenDbNames(): Array<string> {
        const dbNames: Array<string> = [];
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
    public async openDb({
        orbitDbId,
        dbName,
        dbType,
        options
    } : {
        orbitDbId?: IdReference['name'],
        dbName: string,
        dbType: OrbitDbTypes,
        dialAddress?: string,
        options?: Map<string, string>
    }): Promise<{
        openDb: OpenDb,
        address?: string,
        podId: IdReference,
        multiaddrs?: Multiaddr[]
    } | undefined> {
        //get a pod with an orbitDbProcess
        let orbitDbPod: LunarPod | undefined;
        let openDbOptions: {
            databaseName: string,
            databaseType: OrbitDbTypes | string,
            options: Map<string, string>
        };
        let openDb: OpenDb | undefined;

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
                }
            }
        }

        if (orbitDbId) {
            orbitDbPod = this.pods.find(pod => {
                logger({
                    level: LogLevel.INFO,
                    message: `Checking pod ${pod.id.name} for orbitDb`
                })

                if (pod.orbitDb &&
                    pod.id.name === orbitDbId &&
                    pod.db.size > 0
                ) {
                    openDb = pod.getOpenDb(dbName);
                    return {
                        openDb,
                        type: openDb?.options?.databaseType,
                        address: openDb?.address(),
                        multiaddrs: pod.libp2p?.getMultiaddrs(),
                    }
                }
            });
        }
        else {
            orbitDbPod = this.pods.find(pod => pod.db.size === 0);
        }

        if (!orbitDbPod ||
            !orbitDbPod.orbitDb ||
            orbitDbPod?.db?.size > 0
        ) {
            const podId = await this.newPod(new IdReference({component: Component.POD, type: this.options.nameType}), Component.ORBITDB);

            orbitDbPod = this.getPod(podId);
            logger({
                level: LogLevel.INFO,
                message: `New pod ${podId?.getId()} created for orbitDb`
            
            })
        }


        if (orbitDbPod && orbitDbPod.orbitDb) {
            openDbOptions = {
                databaseName: dbName,
                databaseType: dbType,
                options: options? options : new Map<string, string>()
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
                }
            }
        }
    }

    /**
     * Gets the open database with the specified name or ID.
     */
    public getOpenDb(dbName: string | IdReference): OpenDb | undefined {
        let orbitDbId: string;
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
    public async closeDb(dbName: string | IdReference): Promise<string | undefined> {
        let orbitDbId: string;
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

export {
    PodBay,
    LunarPod
};

export * from "./open.js";
export * from "./pod.js";
export * from "./orbitDb.js";
export * from "./ipfs.js";
export * from "./libp2p/index.js";
export * from "./command.js";
export * from "./base.js"
