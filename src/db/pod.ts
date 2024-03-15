
import { Libp2pProcess, _Libp2pOptions } from "./libp2p.js";
import { _IpfsOptions, IpfsProcess } from "./ipfs.js";
import { Component, LogLevel, ProcessStage, isComponent } from "../utils/constants.js";
import { IdReference } from "../utils/id.js";
import { OrbitDbProcess, _OrbitDbOptions } from "./orbitDb.js";
import { OpenDb, _OpenDbOptions } from "./open.js";
import { logger } from "../utils/logBook.js";


/**
 * Represents a LunarPod, which is a container for managing various components and databases.
 * @category Pod
*/
class LunarPod {
    public id: IdReference;
    public libp2p?: Libp2pProcess;
    public ipfs?: IpfsProcess;
    public orbitDb?: OrbitDbProcess;
    public db: Map<string, OpenDb> = new Map<string, OpenDb>();

    /**
     * Construct a new Lunar Pod that is ready for initialization.
     */
    constructor({
        id,
        libp2p,
        ipfs,
        orbitDb,
    }: {
        id?: IdReference,
        libp2p?: Libp2pProcess,
        ipfs?: IpfsProcess,
        orbitDb?: OrbitDbProcess,
    } = {}) {
        this.id = id ? id : new IdReference({ component: Component.POD });
        if (libp2p) {
            this.libp2p = libp2p;
        }
        if (ipfs) {
            this.ipfs = ipfs;
        }
        if (orbitDb) {
            this.orbitDb = orbitDb;
        }
    }

    /**
     * Get the components and their statuses for this pod.
     */
    public getComponents(): Array<{id: IdReference, status: ProcessStage}> {
        const componentIds = [
            this.libp2p?.id,
            this.ipfs?.id,
            this.orbitDb?.id,
            ...Array.from(this.db.keys()).map(key => new IdReference({id: key, component: Component.DB}))
        ].filter(id => id !== undefined) as Array<IdReference>;

        const componentStatuses = [
            this.libp2p?.checkStatus(),
            this.ipfs?.checkStatus(),
            this.orbitDb?.checkStatus(),
            ...Array.from(this.db.values()).map(db => db.checkStatus())
        ].filter(status => status !== undefined) as Array<ProcessStage>;

        return componentIds.map((id, index) => {
            return {
                id,
                status: componentStatuses[index]
            }
        });
    }

    /**
     * Initialize all components and databases in the pod.
     */
    private async initAll(): Promise<void> {
        if ((this.orbitDb && !this.ipfs)  || (this.orbitDb && !this.libp2p)) {
            throw new Error('OrbitDb requires both IPFS and libp2p to be initialized');
        }

        if (this.ipfs && !this.libp2p) {
            throw new Error('IPFS requires libp2p to be initialized');
        }

        if (!this.libp2p) {
            await this.initLibp2p({});
        }
        if (!this.ipfs) {
            await this.initIpfs({});
        }
        if (!this.orbitDb) {
            await this.initOrbitDb({});
        }
    }

    /**
     * Initialize a specific component or all components in the pod.
     */
    public async init(component?: string): Promise<void> {
        if (component) {
            component = isComponent(component);
        }
        else {
            await this.initAll();
            return;
        }

        switch (component) {
            case Component.LIBP2P:
                await this.initLibp2p({});
                break;
            case Component.IPFS:
                await this.initIpfs({});
                break;
            case Component.ORBITDB:
                await this.initOrbitDb({});
                break;
            case Component.DB:
                await this.initOpenDb({});
                break;
            default:
                await this.initAll();
                break;
        }
    }

    /**
     * Start the Libp2p process in the pod.
     */
    public async initLibp2p({
        libp2pOptions
    }: {
        libp2pOptions?: _Libp2pOptions,
    } = {}): Promise<void> {
        if (!this.libp2p) {
            this.libp2p = new Libp2pProcess({
                id: new IdReference({
                    component: Component.LIBP2P,
                    type: this.id.nameType
                }),
                options: libp2pOptions
            });
        }
        await this.libp2p.init();

        if (libp2pOptions?.start) {
            await this.libp2p.start();
        }
    }

    /**
     * Start the IPFS process in the pod.
     */
    public async initIpfs({
        ipfsOptions
    }: {
        ipfsOptions?: _IpfsOptions
    } = {}): Promise<void> {
        
        if (!this.libp2p) {
            await this.initLibp2p();
        }
        
        if (!this.ipfs) {
            ipfsOptions = new _IpfsOptions({
                libp2p: this.libp2p,
                datastore: ipfsOptions?.datastore,
                blockstore: ipfsOptions?.blockstore,
                start: ipfsOptions?.start
            });

            this.ipfs = new IpfsProcess({
                id: new IdReference({
                    component: Component.IPFS,
                    type: this.id.nameType
                }),
                options: ipfsOptions
            });
        }
        
        await this.ipfs.init();

        if (ipfsOptions?.start) {
            await this.ipfs.start();
        }
    }

    /**
     * Start the OrbitDb process in the pod.
     */
    public async initOrbitDb({
        orbitDbOptions
    }: {
        orbitDbOptions?: _OrbitDbOptions
    } = {}): Promise<void> {

        if (!this.ipfs) {
            await this.initIpfs();
        }

        if (this.libp2p?.checkStatus() !== 'started') {
            await this.libp2p?.start();
        }

        if (!this.orbitDb) {
            orbitDbOptions = new _OrbitDbOptions({
                ipfs: this.ipfs,
                directory: orbitDbOptions?.directory,
                enableDID: orbitDbOptions?.enableDID,
                identityProvider: orbitDbOptions?.identityProvider,
                identitySeed: orbitDbOptions?.identitySeed
            });

            this.orbitDb = new OrbitDbProcess({
                id: new IdReference({
                    component: Component.ORBITDB,
                    type: this.id.nameType
                }),
                options: orbitDbOptions
            });
        }
        await this.orbitDb.init();
    }

    /**
     * Start the OrbitDb process in the pod.
     */
    public async initOpenDb({
        databaseName,
        databaseType,
        options
    }: {
        databaseName?: string,
        databaseType?: string,
        options?: Map<string, string>
    }): Promise<OpenDb | undefined> {
        if (!this.orbitDb) {
            await this.initOrbitDb({});
        }

        if (this.orbitDb) {
            const openDbOptions = new _OpenDbOptions({
                orbitDb: this.orbitDb,
                databaseName,
                databaseType,
                options
            });

            if (openDbOptions) {
                // check if the orbitdb is already open
                if (this.db.has(openDbOptions.databaseName)) {
                    return
                }
            }

            logger({
                level: LogLevel.INFO,
                podId: this.id,
                stage: ProcessStage.INIT,
                message: `Opening database ${openDbOptions?.databaseName} on OrbitDb ${this.orbitDb.id.name} in LunarPod ${this.id.name}`
            })

            const db = new OpenDb({
                id: new IdReference({
                    id: databaseName,
                    component: Component.DB,
                    type: this.id.nameType
                }),
                options: openDbOptions
            });

            try {
                await db.init();

                const orbitDbName = databaseName ? databaseName : db.id.name;

                this.db.set(orbitDbName , db);
    
                return db;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
                await this.stop()
                throw error;
            }
        }
    }

    /**
     * Get the OrbitDb process in the pod.
     */
    public getOpenDb(orbitDbName: string): OpenDb | undefined {
        return this.db.get(orbitDbName);
    }

    /**
     * Get all Open Databases in the pod.
     */
    public getAllOpenDbs(): Map<string, OpenDb> {
        return this.db;
    }

    /**
     * Get the names of all Open Databases in the pod.
     */
    public getDbNames(): Array<string> {
        return Array.from(this.db.keys());
    }

    /**
     * Start a component or all components in the pod.
     */
    public async start(
        component: string = 'all'
    ): Promise<void> {
        if (
            ( this.libp2p && component === 'all' ) ||
            ( this.libp2p && component === 'libp2p' )
        ) {
            await this.libp2p.start();
        }

        if (
            ( this.ipfs && component === 'all' ) ||
            ( this.ipfs && component === 'ipfs' )
        ) {
            await this.ipfs.start();
        }

        if (
            ( this.orbitDb && component === 'all' ) ||
            ( this.orbitDb && component === 'orbitdb' )
        ) {
            await this.orbitDb.start();
        }
    }

    /**
     * Stop a specific open database in the pod.
     */
    public async stopOpenDb(orbitDbName: string): Promise<void> {
        const db = this.db.get(orbitDbName);
        if (db) {
            await db.stop();
            this.db.delete(orbitDbName);
        }
    }

    /**
     * Stop specific components or all components in the pod.
     */
    public async stop(component: string = 'all'): Promise<void> {
        if (
            ( this.db && component === 'all' ) ||
            ( this.db && component === 'db' )
        ) {
            this.db.forEach(async db => {
                await db.stop();
            });
        }

        if (
            ( this.orbitDb && component === 'all' ) ||
            ( this.orbitDb && component === 'orbitdb' )
        ) {
            await this.orbitDb.stop();
        }

        if (
            ( this.ipfs && component === 'all' ) ||
            ( this.ipfs && component === 'ipfs' )
        ) {
            await this.ipfs.stop();
        }

        if (
            ( this.libp2p && component === 'all' ) ||
            ( this.libp2p && component === 'libp2p' )
        ) {
            await this.libp2p.stop();
        }
    }

    /**
     * Restart specific components or all components in the pod.
     */
    public async restart(component: string = 'all'): Promise<void> {
        return this.stop(component).then( async () => await this.start(component));
    }

    /**
     * Get the status of all components and databases in the pod.
     */
    public status(): {
        libp2p?: ProcessStage,
        ipfs?: ProcessStage,
        orbitdb?: ProcessStage,
        db?: Array<ProcessStage>
    } {
        return {
            libp2p: this.libp2p?.checkStatus(), 
            ipfs: this.ipfs?.checkStatus(),
            orbitdb: this.orbitDb?.checkStatus(),
            db: Array.from(this.db.values()).map(db => db.checkStatus())
        }
    }
}


export { LunarPod };