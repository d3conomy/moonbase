
import { Libp2pProcess, _Libp2pOptions } from "./libp2p.js";
import { _IpfsOptions, IpfsProcess } from "./ipfs.js";
import { Component, LogLevel } from "../utils/constants.js";
import { IdReference } from "../utils/id.js";
import { OrbitDbProcess, _OrbitDbOptions } from "./orbitDb.js";
import { OpenDb, OrbitDbTypes, _OpenDbOptions } from "./open.js";
import { logger } from "../utils/logBook.js";
import { _Status } from "./base.js";


const isComponent = (component: string): Component => {
    if (Object.values(Component).includes(component as Component)) {
        return component as Component;
    }
    throw new Error('Invalid component');
}

class LunarPod {
    public id: IdReference;
    public libp2p?: Libp2pProcess;
    public ipfs?: IpfsProcess;
    public orbitDb?: OrbitDbProcess;
    public db: Map<string, OpenDb> = new Map<string, OpenDb>();

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
    }) {
        this.id = id ? id : new IdReference({ component: Component.POD });
        if (orbitDb) {
            this.orbitDb = orbitDb;
            this.setOrbitDbProcesses();
        }
        else if (ipfs) {
            this.ipfs = ipfs;
            this.setIpfsProcesses();
        }
        else if (libp2p) {
            this.libp2p = libp2p;
        }
    }

    public getComponents(): Array<{id: IdReference, status: _Status}> {
        const componentIds = [
            this.libp2p?.id,
            this.ipfs?.id,
            this.orbitDb?.id,
            ...Array.from(this.db.keys()).map(key => new IdReference({id: key, component: Component.DB}))
        ].filter(id => id !== undefined) as Array<IdReference>;

        const componentStatuses = [
            this.libp2p?.checkStatus(),
            this.ipfs?.status,
            this.orbitDb?.status,
            ...Array.from(this.db.values()).map(db => db.status)
        ].filter(status => status !== undefined) as Array<_Status>;

        return componentIds.map((id, index) => {
            return {
                id,
                status: componentStatuses[index]
            }
        });
    }

    private async initAll(): Promise<void> {
        if (!this.libp2p) {
            await this.initLibp2p({});
        }
        if (!this.ipfs) {
            await this.initIpfs({});
        }
        if (!this.orbitDb) {
            await this.initOrbitDb({});
        }
        // await this.libp2p?.start();
    }

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
                // await this.libp2p?.start();
                await this.initIpfs({});
                break;
            case Component.ORBITDB:
                // await this.libp2p?.start();
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

    private setOrbitDbProcesses(): void {
        if (this.orbitDb) {
            logger({
                level: LogLevel.INFO,
                message: `Setting OrbitDb process and sub-processes, ignoring redundant libp2p and ipfs options.`
            })
            this.libp2p = new Libp2pProcess({
                id: new IdReference({
                    component: Component.LIBP2P
                }),
                process: this.orbitDb.process?.ipfs?.libp2p
            });
            this.ipfs = new IpfsProcess({
                id: new IdReference({
                    component: Component.IPFS
                }),
                options: new _IpfsOptions({
                    libp2p: this.libp2p
                })
            }); 

            return
        }
    }

    private setIpfsProcesses(): void {
        if (this.ipfs) {
            logger({
                level: LogLevel.INFO,
                message: `Setting IPFS process and sub-processes, ignoring redundant libp2p options.`
            })
            this.libp2p = new Libp2pProcess({
                id: new IdReference({
                    component: Component.LIBP2P
                }),
                process: this.ipfs.process?.libp2p
            });
            return
        }
    }

    public async initLibp2p({
        libp2pOptions
    }: {
        libp2pOptions?: _Libp2pOptions,
    } = {}): Promise<void> {
        if (!this.libp2p) {
            this.libp2p = new Libp2pProcess({
                id: new IdReference({
                    component: Component.LIBP2P
                }),
                options: libp2pOptions
            });
        }
        await this.libp2p.init();

        if (libp2pOptions?.start) {
            await this.libp2p.start();
        }
    }

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
                    component: Component.IPFS
                }),
                options: ipfsOptions
            });
        }
        
        await this.ipfs.init();

        if (ipfsOptions?.start) {
            await this.ipfs.start();
        }
    }

    public async initOrbitDb({
        orbitDbOptions
    }: {
        orbitDbOptions?: _OrbitDbOptions
    } = {}): Promise<void> {

        if (!this.ipfs) {
            await this.initIpfs();
        }

        if (this.libp2p?.status?.stage !== 'started') {
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
                    component: Component.ORBITDB
                }),
                options: orbitDbOptions
            });
        }
        await this.orbitDb.init();
    }

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

            // if (openDbOptions) {
            //     // check if the orbitdb is already open
            //     if (this.db.has(openDbOptions.databaseName)) {
            //         return `Database ${openDbOptions.databaseName} already open`
            //     }
            // }

            logger({
                level: LogLevel.INFO,
                message: `Opening database ${openDbOptions?.databaseName}`
            })

            const db = new OpenDb({
                id: new IdReference({
                    id: databaseName,
                    component: Component.DB
                }),
                options: openDbOptions
            });

            try {
                await db.init();
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    message: `Error opening database: ${error}`
                });
            }

            const orbitDbName = databaseName ? databaseName : db.id.name;

            this.db.set(orbitDbName , db);

            return db;
        }
        // return `Database ${databaseName} not opened`;
    }

    public getOpenDb(orbitDbName: string): OpenDb | undefined {
        return this.db.get(orbitDbName);
    }

    public getAllOpenDbs(): Map<string, OpenDb> {
        return this.db;
    }

    public getDbNames(): Array<string> {
        return Array.from(this.db.keys());
    }

    public async stopOpenDb(orbitDbName: string): Promise<void> {
        const db = this.db.get(orbitDbName);
        if (db) {
            await db.stop();
            this.db.delete(orbitDbName);
        }
    }

    public async stop(): Promise<void> {
        if (this.db) {
            this.db.forEach(async db => {
                await db.stop();
            });
        }
        if (this.orbitDb) {
            await this.orbitDb.stop();
        }
        if (this.ipfs) {
            await this.ipfs.stop();
        }
        if (this.libp2p) {
            await this.libp2p.stop();
        }
    }

    public status(): {} {
        return {
            libp2p: this.libp2p?.checkStatus(), 
            ipfs: this.ipfs?.status,
            orbitdb: this.orbitDb?.status,
            db: this.db?.forEach(db => db.status)
        }
    }
}


export { LunarPod };