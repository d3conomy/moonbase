import { Libp2pProcess } from "../libp2p-process/index.js";
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
    id;
    libp2p;
    ipfs;
    orbitDb;
    db = new Map();
    /**
     * Construct a new Lunar Pod that is ready for initialization.
     */
    constructor({ id, libp2p, ipfs, orbitDb, } = {}) {
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
    getComponents() {
        const componentIds = [
            this.libp2p?.id,
            this.ipfs?.id,
            this.orbitDb?.id,
            ...Array.from(this.db.keys()).map(key => new IdReference({ id: key, component: Component.DB }))
        ].filter(id => id !== undefined);
        const componentStatuses = [
            this.libp2p?.checkStatus(),
            this.ipfs?.checkStatus(),
            this.orbitDb?.checkStatus(),
            ...Array.from(this.db.values()).map(db => db.checkStatus())
        ].filter(status => status !== undefined);
        return componentIds.map((id, index) => {
            return {
                id,
                status: componentStatuses[index]
            };
        });
    }
    /**
     * Initialize all components and databases in the pod.
     */
    async initAll() {
        if ((this.orbitDb && !this.ipfs) || (this.orbitDb && !this.libp2p)) {
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
    async init(component) {
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
    async initLibp2p({ libp2pOptions } = {}) {
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
        if (libp2pOptions?.processConfig?.autoStart) {
            await this.libp2p.start();
        }
    }
    /**
     * Start the IPFS process in the pod.
     */
    async initIpfs({ ipfsOptions } = {}) {
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
    async initOrbitDb({ orbitDbOptions } = {}) {
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
    async initOpenDb({ databaseName, databaseType, options } = {}) {
        if (!this.orbitDb) {
            await this.initOrbitDb();
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
                    return;
                }
            }
            logger({
                level: LogLevel.INFO,
                podId: this.id,
                stage: ProcessStage.INIT,
                message: `Opening database ${openDbOptions?.databaseName} on OrbitDb ${this.orbitDb.id.name} in LunarPod ${this.id.name}`
            });
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
                this.db.set(orbitDbName, db);
                return db;
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
                await this.stop();
                throw error;
            }
        }
    }
    /**
     * Get the OrbitDb process in the pod.
     */
    getOpenDb(orbitDbName) {
        return this.db.get(orbitDbName);
    }
    /**
     * Get all Open Databases in the pod.
     */
    getAllOpenDbs() {
        return this.db;
    }
    /**
     * Get the names of all Open Databases in the pod.
     */
    getDbNames() {
        return Array.from(this.db.keys());
    }
    /**
     * Start a component or all components in the pod.
     */
    async start(component = 'all') {
        if ((this.libp2p && component === 'all') ||
            (this.libp2p && component === 'libp2p')) {
            await this.libp2p.start();
        }
        if ((this.ipfs && component === 'all') ||
            (this.ipfs && component === 'ipfs')) {
            await this.ipfs.start();
        }
        if ((this.orbitDb && component === 'all') ||
            (this.orbitDb && component === 'orbitdb')) {
            await this.orbitDb.start();
        }
    }
    /**
     * Stop a specific open database in the pod.
     */
    async stopOpenDb(orbitDbName) {
        const db = this.db.get(orbitDbName);
        if (db) {
            await db.stop();
            this.db.delete(orbitDbName);
        }
    }
    /**
     * Stop specific components or all components in the pod.
     */
    async stop(component = 'all') {
        if ((this.db && component === 'all') ||
            (this.db && component === 'db')) {
            this.db.forEach(async (db) => {
                await db.stop();
            });
        }
        if ((this.orbitDb && component === 'all') ||
            (this.orbitDb && component === 'orbitdb')) {
            await this.orbitDb.stop();
        }
        if ((this.ipfs && component === 'all') ||
            (this.ipfs && component === 'ipfs')) {
            await this.ipfs.stop();
        }
        if ((this.libp2p && component === 'all') ||
            (this.libp2p && component === 'libp2p')) {
            await this.libp2p.stop();
        }
    }
    /**
     * Restart specific components or all components in the pod.
     */
    async restart(component = 'all') {
        return this.stop(component).then(async () => await this.start(component));
    }
    /**
     * Get the status of all components and databases in the pod.
     */
    status() {
        return {
            libp2p: this.libp2p?.checkStatus(),
            ipfs: this.ipfs?.checkStatus(),
            orbitdb: this.orbitDb?.checkStatus(),
            db: Array.from(this.db.values()).map(db => db.checkStatus())
        };
    }
}
export { LunarPod };
