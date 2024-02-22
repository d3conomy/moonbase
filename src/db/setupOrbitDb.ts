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
import { Helia } from 'helia';
import { Node } from './node.js';



class OrbitDbOptions {
    ipfs: Helia;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;

    constructor({
        ipfs,
        enableDID,
        identitySeed,
        identityProvider,
    }: {
        ipfs: Node | Helia;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
    }) {
        if(ipfs instanceof Node) {
            this.ipfs = ipfs.process;
        }
        else {
            this.ipfs = ipfs;
        }


        this.enableDID = enableDID ? enableDID : false;
        this.identitySeed = identitySeed;
        this.identityProvider = identityProvider;
    }

}

const defaultOrbitDbOptions = ({
    ipfs,
    enableDID = false,
    identitySeed,
    identityProvider
}: {
    ipfs: Helia;
    enableDID?: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;

}) => {
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
        ipfs,
        enableDID,
        identitySeed,
        identityProvider
    }
}


const createOrbitDbProcess = async ({
    ipfs,
    enableDID,
    identitySeed,
    identityProvider,
}: {
    ipfs: Helia;
    enableDID?: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
}): Promise<any> => {
    const orbitDbOptions = defaultOrbitDbOptions({
        ipfs: ipfs,
        enableDID: enableDID ? enableDID : false,
        identitySeed: identitySeed,
        identityProvider: identityProvider
    
    });
    let orbitDb: typeof OrbitDb | undefined = undefined;

    if (orbitDbOptions.enableDID) {

        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            message: `Creating OrbitDB process with DID identity provider...`
        });
        // try {
            return await createOrbitDB({
                ipfs: ipfs, 
                identity: {
                    provider: orbitDbOptions.identityProvider
                }
            });
            // return orbitDb
        // }
        // catch (error) {
        //     logger({
        //         level: LogLevel.ERROR,
        //         component: Component.ORBITDB,
        //         code: ResponseCode.INTERNAL_SERVER_ERROR,
        //         message: `Error creating OrbitDB process: ${error}`
        //     });
        // }
    }
    else {
        logger({
            level: LogLevel.INFO,
            component: Component.ORBITDB,
            message: `Creating OrbitDB process with no identity provider...`
        });
       
        // try {
            return await createOrbitDB({ ipfs: ipfs });
            logger({
                level: LogLevel.INFO,
                component: Component.ORBITDB,
                message: `OrbitDB process created ${orbitDb.ipfs.libp2p.peerId.toString()}`
            });
        // }
        // catch (error) {
        //     logger({
        //         level: LogLevel.ERROR,
        //         component: Component.ORBITDB,
        //         code: ResponseCode.INTERNAL_SERVER_ERROR,
        //         message: `Error creating OrbitDB process: ${error}`
        //     });
        // }
        return orbitDb
    }
    
    return orbitDb;
}

export {
    OrbitDbOptions,
    defaultOrbitDbOptions,
    createOrbitDbProcess
}
