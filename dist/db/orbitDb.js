import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did';
import KeyDidResolver from 'key-did-resolver';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { useIdentityProvider, createOrbitDB } from '@orbitdb/core';
import { logger } from '../utils/index.js';
import { Component, LogLevel, ResponseCode } from '../utils/constants.js';
import { IdReference } from '../utils/id.js';
import { _BaseProcess } from './base.js';
/**
 * Create an identity provider
 * @category OrbitDb
 * @todo Add support for other identity providers
 * @todo Add support for other identity seeds
 */
const createIdentityProvider = ({ identitySeed, identityProvider }) => {
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
    OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver());
    useIdentityProvider(OrbitDBIdentityProviderDID);
    const didProvider = new Ed25519Provider(identitySeed);
    identityProvider = OrbitDBIdentityProviderDID({ didProvider });
    return identityProvider;
};
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
class _OrbitDbOptions {
    ipfs;
    enableDID;
    identitySeed;
    identityProvider;
    directory;
    constructor({ ipfs, enableDID, identitySeed, identityProvider, directory }) {
        if (!ipfs) {
            throw new Error(`No Ipfs process found`);
        }
        this.ipfs = ipfs;
        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
        this.directory = directory ? directory : `./orbitdb/${new IdReference({ component: Component.DB }).getId()}`;
        if (this.enableDID) {
            this.identityProvider = createIdentityProvider({
                identitySeed: this.identitySeed,
                identityProvider: this.identityProvider
            });
        }
    }
}
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
const createOrbitDbProcess = async (options) => {
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
};
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
class OrbitDbProcess extends _BaseProcess {
    constructor({ id, process, options }) {
        super({
            component: Component.ORBITDB,
            id: id,
            process: process,
            options: options
        });
    }
    /**
     * Initialize the OrbitDb process
     */
    async init() {
        if (this.process) {
            logger({
                level: LogLevel.ERROR,
                processId: this.id,
                message: `OrbitDb process already exists`
            });
            return;
        }
        if (!this.options) {
            throw new Error(`No OrbitDb options found`);
        }
        if (!this.options.ipfs) {
            throw new Error(`No Ipfs process found`);
        }
        this.process = await createOrbitDbProcess(this.options);
    }
    /**
     * Open an OrbitDb database
     */
    async open({ databaseName, databaseType, options }) {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                name: Component.ORBITDB,
                code: ResponseCode.NOT_FOUND,
                message: `No OrbitDb process found`
            });
        }
        else {
            try {
                if (databaseName.startsWith('/orbitdb')) {
                    return await this.process.open(databaseName);
                }
                ;
                return await this.process.open(databaseName, {
                    type: databaseType
                });
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    name: Component.ORBITDB,
                    message: `Error opening database process: ${error}`
                });
                throw error;
            }
        }
    }
    /**
     * Stop the OrbitDb process
     */
    async stop() {
        if (this.process) {
            try {
                await this.process.stop();
                logger({
                    level: LogLevel.INFO,
                    processId: this.id,
                    message: `OrbitDb process stopped`
                });
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    processId: this.id,
                    message: `Error stopping OrbitDb process: ${error}`
                });
                throw error;
            }
        }
    }
}
export { _OrbitDbOptions, createIdentityProvider, createOrbitDbProcess, OrbitDbProcess };
