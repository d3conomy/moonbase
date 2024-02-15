import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
import KeyDidResolver from 'key-did-resolver'

import {
    Ed25519Provider
} from 'key-did-provider-ed25519'


import {
    useIdentityProvider,
    OrbitDb,
    createOrbitDb
} from '@orbitdb/core';

import {
    logger
} from '../utils/index.js';

import {
    Component,
    LogLevel,
    ResponseCode
} from '../utils/constants.js';
import { Helia } from 'helia';



class OrbitDbOptions {
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;

    constructor({
        enableDID,
        identitySeed,
        identityProvider,
    }: {
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
    }) {
        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
    }

}

const defaultOrbitDbOptions = ({
    enableDID = false,
    identitySeed,
    identityProvider
}: OrbitDbOptions) => {
    if (enableDID) {
        if (!identitySeed) {
            logger({
                level: LogLevel.WARN,
                component: Component.ORBITDB,
                code: ResponseCode.NOT_FOUND,
                message: `No identity seed provided. Using hardcoded seed...`
            });
            identitySeed = new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245]);
        }

        try {
            OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
            useIdentityProvider(OrbitDBIdentityProviderDID)
            const didProvider = new Ed25519Provider(identitySeed)
            identityProvider = OrbitDBIdentityProviderDID({ didProvider })
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
            enableDID: enableDID,
        })}`,
    });

    return {
        enableDID,
        identitySeed,
        identityProvider
    } as OrbitDbOptions;
}


const createOrbitDbNode = async ({
    ipfs,
    options
}: {
    ipfs: Helia,
    options?: OrbitDbOptions
}
    ) => {
    const orbitDbOptions = defaultOrbitDbOptions({
        enableDID: options?.enableDID ? options?.enableDID : false,
        identitySeed: options?.identitySeed,
        identityProvider: options?.identityProvider
    
    });
    let orbitDb: typeof OrbitDb | undefined = undefined;

    if (orbitDbOptions.enableDID) {
        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            message: `Creating OrbitDB node with DID identity provider...`
        });
        orbitDb = await createOrbitDb({
            ipfs, 
            identity: {
                provider: options?.identityProvider
            }
        });
    }
    else {
        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            message: `Creating OrbitDB node with no identity provider...`
        });
        orbitDb = await createOrbitDb({ ipfs });
    }
    return orbitDb;
}

export {
    OrbitDbOptions,
    defaultOrbitDbOptions,
    createOrbitDbNode
}
