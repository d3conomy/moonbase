import { LunarPod } from "./pod.js";
import { IdReference } from "../utils/id.js";
import { logger } from "../utils/logBook.js";
import { Component, LogLevel, ProcessStage } from "../utils/constants.js";
import { OpenDb, OrbitDbTypes, _OpenDbOptions } from "./open.js";
import { Multiaddr } from "@multiformats/multiaddr";


class PodBay {
    public pods: Array<LunarPod>;

    constructor(pods?: Array<LunarPod>) {
        this.pods = pods ? pods : new Array<LunarPod>();
    }

    public podIds(): Array<string> {
        return this.pods.map(pod => pod.id.getId());
    }

    public checkPodId(id?: IdReference): boolean {
        if (!id) {
            throw new Error('IdReference is undefined');
        }

        return this.podIds().includes(id.getId());
    }

    public async newPod(id?: IdReference, component?: Component): Promise<IdReference | undefined> {
        if (!id) {
            id = new IdReference({ component: Component.POD});
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

    public addPod(pod: LunarPod): void {
        if (!this.checkPodId(pod.id)) {
            this.pods.push(pod);
        }
        else {
            throw new Error(`Pod with id ${pod.id.getId()} already exists`);
        }
    }

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

    public getAllOpenDbNames(): Array<string> {
        const dbNames: Array<string> = [];
        this.pods.forEach(pod => {
            pod.db.forEach(db => {
                dbNames.push(db.id.getId());
            });
        });
        return dbNames;
    }

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
            const podId = await this.newPod(new IdReference({component: Component.POD }), Component.ORBITDB);
            // orbitDbPod = this.pods.find(pod => pod.id.getId() === podId?.getId());
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