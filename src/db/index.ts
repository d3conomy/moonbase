import { LunarPod } from "./pod.js";
import { IdReference } from "../utils/id.js";
import { logger } from "../utils/logBook.js";
import { Component, LogLevel } from "../utils/constants.js";
import { _IBaseStatus, _Status } from "./base.js";
import { OrbitDbTypes, _OpenDbOptions } from "./open.js";


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
            id = new IdReference({ component: Component.POD });
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
            throw new Error(`Pod with id ${pod.id} already exists`);
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
            await pod.stop();
            const index = this.pods.indexOf(pod);
            this.pods.splice(index, 1);
            logger({
                level: LogLevel.INFO,
                message: `Pod with id ${id.getId()} removed`
            });
        }
        else {
            throw new Error(`Pod with id ${id.getId()} not found`);
        }
    }

    public getStatus(id: IdReference): _Status | undefined {
        const pod = this.getPod(id);
        if (pod && pod.libp2p) {
            return pod.libp2p.checkStatus()
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
        options?: any
    }): Promise<string> {
        //get a pod with an orbitDbProcess
        let orbitDbPod: LunarPod | undefined;
        let openDbOptions: _OpenDbOptions;

        if (orbitDbId) {
            orbitDbPod = this.pods.find(pod => {
                logger({
                    level: LogLevel.INFO,
                    message: `Checking pod ${pod.id.name} for orbitDb`
                
                })
                if (pod.orbitDb) {
                    if (pod.id.name === orbitDbId) {
                        return pod;
                    }
                }
            });
        }
        else {
            orbitDbPod = this.pods.find(pod => pod.orbitDb);
            logger({
                level: LogLevel.INFO,
                message: `Checking all pods for orbitDb ${orbitDbPod?.id.name}`
            
            })
        }

        if (!orbitDbPod) {
            const podId = await this.newPod(new IdReference({component: Component.POD}), Component.ORBITDB);
            // orbitDbPod = this.pods.find(pod => pod.id.getId() === podId?.getId());
            orbitDbPod = this.getPod(podId);
        }

        if (orbitDbPod && orbitDbPod.orbitDb) {
            openDbOptions = new _OpenDbOptions({
                orbitDb: orbitDbPod.orbitDb,
                databaseName: dbName,
                databaseType: dbType,
            });
            return await orbitDbPod?.initOpenDb({openDbOptions});
        }
        return `Database ${dbName} not opened`;
        
    }
}

export { PodBay };