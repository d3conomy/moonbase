import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'

import {
    Ed25519Provider
} from 'key-did-provider-ed25519'


import {
    useIdentityProvider,
    OrbitDb,
    createOrbitDB
} from '@orbitdb/core';

import {
    logger
} from '../utils/index.js';

import {
    Component,
    LogLevel,
    ResponseCode
} from '../utils/constants.js';
import { IpfsProcess } from './ipfs.js';
import { IdReference } from '../utils/id.js';
import { _BaseProcess, _Status, _IBaseProcess } from './base.js';


const createIdentityProvider = ({
    identitySeed,
    identityProvider
}: {
    identitySeed?: Uint8Array;
    identityProvider?: any;
}) => {
    if (!identitySeed) {
        logger({
            level: LogLevel.WARN,
            component: Component.ORBITDB,
            code: ResponseCode.NOT_FOUND,
            message: `No identity seed provided. Using hardcoded seed...`
        });
        identitySeed = new Uint8Array([
            157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245,
            222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188,
            87, 191, 33, 95, 58, 136, 46, 218, 219, 245
        ]);
    }

    OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
    useIdentityProvider(OrbitDBIdentityProviderDID)
    const didProvider = new Ed25519Provider(identitySeed)
    identityProvider = OrbitDBIdentityProviderDID({ didProvider })

    return identityProvider
}

class _OrbitDbOptions {
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;

    constructor({
        ipfs,
        enableDID,
        identitySeed,
        identityProvider,
        directory
    }: {
        ipfs?: IpfsProcess;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
        directory?: string;
    }) {
        if (!ipfs) {
            throw new Error(`No Ipfs process found`)
        }
        this.ipfs = ipfs;
        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
        this.directory = directory ? directory : `./orbitdb/${new IdReference({component: Component.DB}).getId()}`;

        if (this.enableDID) {
            this.identityProvider = createIdentityProvider({
                identitySeed: this.identitySeed,
                identityProvider: this.identityProvider
            });
        }
    }
}

const createOrbitDbProcess = async (options: _OrbitDbOptions): Promise<typeof OrbitDb> => {
    if (options.enableDID) {
        return await createOrbitDB({
            ipfs: options.ipfs.process,
            identity: {
                provider: options.identityProvider
            },
            directory: options.directory
        });
    }
    return await createOrbitDB({
        ipfs: options.ipfs.process,
        directory: options.directory
    });
}

class OrbitDbProcess
    extends _BaseProcess
    implements _IBaseProcess
{
    public declare process?: typeof OrbitDb;
    public declare options?: _OrbitDbOptions;

    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: typeof OrbitDb,
        options?: _OrbitDbOptions
    }) {
        super({
            component: Component.ORBITDB,
            id: id,
            process: process,
            options: options
        });
    }

    public async init(): Promise<void> {
        if (this.process) {
            this.status = new _Status({
                stage: this.process.libp2p.status,
                message: `OrbitDb process initialized`
            });
            return;
        }

        if (!this.options) {
            throw new Error(`No OrbitDb options found`)
        }

        if (!this.options.ipfs) {
            throw new Error(`No Ipfs process found`)
        }
        this.process = await createOrbitDbProcess(this.options);
    }

    public async open({
        databaseName,
        databaseType,
        options
    }: {
        databaseName: string;
        databaseType: string;
        options?: Map<string, string>
    }): Promise<void> {
        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            code: ResponseCode.SUCCESS,
            message: `Opening OrbitDb process`
        
        })
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                component: Component.ORBITDB,
                code: ResponseCode.NOT_FOUND,
                message: `No OrbitDb process found`
            })
            // new Error(`No OrbitDb process found`)
        }
        else {
            try {
                logger({
                    level: LogLevel.INFO,
                    component: Component.ORBITDB,
                    message: `Opening OrbitDb process right now`
                
                })
                return await this.process.open(
                    databaseName, 
                    {
                        type: databaseType
                    },
                    options?.entries()
                );
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    component: Component.ORBITDB,
                    message: `Error opening OrbitDb process: ${error}`
                })
                // new Error(`Error opening OrbitDb process: ${error}`)
            }
            
            // logger({
            //     level: LogLevel.INFO,
            //     component: Component.ORBITDB,
            //     code: ResponseCode.SUCCESS,
            //     message: `OrbitDb process opened`
            // })
        }
    }
}

export {
    _OrbitDbOptions,
    createIdentityProvider,
    createOrbitDbProcess,
    OrbitDbProcess
}
