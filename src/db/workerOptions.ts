import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'

import {
    Helia
} from 'helia';

import {
    MemoryBlockstore
} from 'blockstore-core'

import {
    MemoryDatastore
} from 'datastore-core'

import {
    Ed25519Provider
} from 'key-did-provider-ed25519'

import {
    Libp2p,
    Libp2pOptions
} from 'libp2p';

import {
    defaultLibp2pOptions
} from './workerOptionsLibp2p.js';

import {
    useIdentityProvider,
    OrbitDb
} from '@orbitdb/core';

import {
    createRandomId,
    logger
} from '../utils/index.js';

import {
    Component,
    LogLevel,
    ResponseCode
} from '../utils/constants.js';

type WorkerOptions = IWorkerOptions | OrbitDbWorkerOptions | DefaultWorkerOptions;

/**
 * @interface IWorkerOptions
 * @description The Worker Options Interface
 * @member type?: Component - The component type
 * @member id?: string - The System Worker ID of the worker
 * @member libp2pOptions?: Libp2pOptions - The libp2p options
 * @member libp2p?: Libp2p - The libp2p instance
 * @member ipfs?: Helia - The IPFS instance
 * @member blockstore?: any - The blockstore instance
 * @member datastore?: any - The datastore instance
 * @member enableDID?: boolean - Enable DID
 * @member identitySeed?: Uint8Array - The identity seed
 * @member identityProvider?: typeof OrbitDBIdentityProviderDID - The identity provider
 * @member orbitdb?: typeof OrbitDb - The OrbitDB instance
 * @member databaseName?: string - The database name
 * @member databaseType?: string - The database type
 */
interface IWorkerOptions {
    type?: Component;
    id?: string;
    libp2pOptions?: Libp2pOptions;
    libp2p?: Libp2p;
    ipfs?: Helia;
    blockstore?: any;
    datastore?: any;
    enableDID?: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: typeof OrbitDBIdentityProviderDID;
    orbitdb?: typeof OrbitDb;
    databaseName?: string;
    databaseType?: string;
}

class DefaultWorkerOptions
    implements IWorkerOptions
{
    public type?: Component;
    public id?: string;
    public libp2pOptions?: Libp2pOptions;
    public libp2p?: Libp2p;
    public ipfs?: Helia;
    public blockstore?: any;
    public datastore?: any;
    public enableDID?: boolean = true;
    public identitySeed?: Uint8Array;
    public identityProvider?: typeof OrbitDBIdentityProviderDID;
    public orbitdb?: typeof OrbitDb;
    public databaseName?: string;
    public databaseType?: string;

    public constructor(type?: Component, options?: IWorkerOptions) {
        options = options ? options : {} as IWorkerOptions;
        
        if (type && !options?.type) {
            if (type === options.type) {
                this.type = type;
            }
            else {
                logger({
                    level: LogLevel.ERROR,
                    code: ResponseCode.BAD_REQUEST,
                    message: `Component type provided as argument does not match component type in options`
                })
                return;
            }
        }
        else if (!type && options?.type) {
            this.type = options.type;
        }
        else {
            logger({
                level: LogLevel.ERROR,
                code: ResponseCode.BAD_REQUEST,
                message: `Cannot create default worker options.\nNo component type provided as argument or in options`
            })
            return;
        }

        this.id = options.id ? options.id : `${this.type}-` + createRandomId();

        switch (this.type) {
            case Component.LIBP2P:
                this.libp2pOptions = options.libp2pOptions ? options.libp2pOptions : defaultLibp2pOptions;
                this.libp2p = options.libp2p;
                break;
            case Component.IPFS:
                this.libp2p = options.libp2p;
                this.ipfs = options.ipfs;
                this.blockstore = options.blockstore ? options.blockstore : new MemoryBlockstore();
                this.datastore = options.datastore ? options.datastore : new MemoryDatastore();
                break;
            case Component.ORBITDB:
                this.ipfs = options.ipfs;
                this.orbitdb = options.orbitdb;
                this.identityProvider = options.identityProvider;
                this.enableDID = options.enableDID ? options.enableDID : true;
                this.identitySeed = options.identitySeed;
                break;
            case Component.DB:
                this.orbitdb = options.orbitdb;
                this.databaseType = options.databaseType ? options.databaseType : 'events';
                this.databaseName = options.databaseName ? options.databaseName : `${this.databaseType} -` + createRandomId();
                break;
            default:
                break;
        }
        logger({
            level: LogLevel.INFO,
            component: this.type,
            message: `[${this.id}] Default Worker Options for ${this.type}`
        })
    }
}

class OrbitDbWorkerOptions
    extends DefaultWorkerOptions
    implements IWorkerOptions
{
    public constructor(options: IWorkerOptions) {
        super(Component.ORBITDB, options);

        if (this.enableDID) {
            if (!this.identitySeed) {
                logger({
                    level: LogLevel.WARN,
                    component: Component.ORBITDB,
                    code: ResponseCode.NOT_FOUND,
                    message: `No identity seed provided. Using hardcoded seed...`
                });
                this.identitySeed = new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245]);
            }

            try {
                OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
                useIdentityProvider(OrbitDBIdentityProviderDID)
                const didProvider = new Ed25519Provider(this.identitySeed)
                this.identityProvider = OrbitDBIdentityProviderDID({ didProvider })
            } catch (error: any) {
                logger({
                    level: LogLevel.ERROR,
                    component: Component.ORBITDB,
                    code: ResponseCode.INTERNAL_SERVER_ERROR,
                    message: `Error creating DID identity provider: ${error}`
                })
            }
        }
        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            message: `Options: ${JSON.stringify({
                enableDID: this.enableDID,
                databaseName: this.databaseName,
                databaseType: this.databaseType
            })}`,
        })
    }
}

export {
    IWorkerOptions,
    WorkerOptions,
    DefaultWorkerOptions,
    OrbitDbWorkerOptions
}
