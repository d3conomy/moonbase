import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'

import {
    Ed25519Provider
} from 'key-did-provider-ed25519'


import {
    useIdentityProvider,
    OrbitDb,
    createOrbitDB,
    Database
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
import { _BaseProcess, _IBaseProcess } from './base.js';


/**
 * @function createIdentityProvider
 * @description Create an identity provider
 * @param {Uint8Array} identitySeed - The identity seed to use
 * @param {any} identityProvider - The identity provider to use
 * @returns {any} - The created identity provider
 * @public
 * @todo Add support for other identity providers
 * @todo Add support for other identity seeds
 */
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
            name: Component.ORBITDB,
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

/**
* @class _OrbitDbOptions
* @classdesc The options for creating an OrbitDb process
* @property {IpfsProcess} ipfs - The Ipfs process to use
* @property {boolean} enableDID - Whether to enable DID
* @property {Uint8Array} identitySeed - The identity seed to use
* @property {any} identityProvider - The identity provider to use
* @property {string} directory - The directory to use
* @public
*/
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

/**
 * @function createOrbitDbProcess
 * @description Create an OrbitDb process
 * @param {any} options - The options for creating the process
 * @returns {Promise<OrbitDb>} - The created process
 * @public
 */
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

/**
 * @class OrbitDbProcess
 * @classdesc The OrbitDb process
 * @property {OrbitDb} process - The OrbitDb instance
 * @property {_OrbitDbOptions} options - The options for creating the process
 * @public
 * @extends _BaseProcess
 * @implements _IBaseProcess
 */
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

    /**
     * @function init
     * @description Initialize the OrbitDb process
     * @returns {Promise<void>} - The result of the init
     * @public
     * @memberof OrbitDbProcess
     * @instance
     * @override
     * @async 
     */
    public async init(): Promise<void> {
        if (this.process) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `OrbitDb process already exists`
            })
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

    /**
     * @function stop
     * @description Stop the OrbitDb process
     * @returns {Promise<void>} - The result of the stop
     * @public
     * @memberof OrbitDbProcess
     * @instance
     * @override
     * @async
     */
    public async open({
        databaseName,
        databaseType,
        options
    }: {
        databaseName: string;
        databaseType: string;
        options?: Map<string, string>
    }): Promise<typeof Database> {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                name: Component.ORBITDB,
                code: ResponseCode.NOT_FOUND,
                message: `No OrbitDb process found`
            })
            // new Error(`No OrbitDb process found`)
        }
        else {
            try {
                if (databaseName.startsWith('/orbitdb')) {
                    return await this.process.open(
                        databaseName
                    )
                };

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
                    name: Component.ORBITDB,
                    message: `Error opening database process: ${error}`
                })
                throw error;
            }
        }
    }

    public async stop(): Promise<void> {
        if (this.process) {
            try {
                await this.process.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `OrbitDb process stopped`
                })
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping OrbitDb process: ${error}`
                })
                throw error;
            }
        }
    }
}

export {
    _OrbitDbOptions,
    createIdentityProvider,
    createOrbitDbProcess,
    OrbitDbProcess
}
