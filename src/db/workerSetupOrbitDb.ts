// import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did'
// import KeyDidResolver from 'key-did-resolver'


// import {
//     Ed25519Provider
// } from 'key-did-provider-ed25519'


// import {
//     useIdentityProvider,
//     OrbitDb
// } from '@orbitdb/core';

// import {
//     createRandomId,
//     logger
// } from '../utils/index.js';

// import {
//     Component,
//     LogLevel,
//     ResponseCode
// } from '../utils/constants.js';

// import {
//     WorkerProcess
// } from './worker.js';


// class OrbitDbWorkerSetup
// {
//     public constructor(options: IWorkerOptions) {
//         super(Component.ORBITDB, options);

//         if (this.enableDID) {
//             if (!this.identitySeed) {
//                 logger({
//                     level: LogLevel.WARN,
//                     component: Component.ORBITDB,
//                     code: ResponseCode.NOT_FOUND,
//                     message: `No identity seed provided. Using hardcoded seed...`
//                 });
//                 this.identitySeed = new Uint8Array([157, 94, 116, 1918, 1239, 238, 91, 229, 173, 82, 245, 222, 199, 7, 183, 177, 123, 238, 83, 240, 143, 188, 87, 191, 33, 95, 58, 136, 46, 218, 219, 245]);
//             }

//             try {
//                 OrbitDBIdentityProviderDID.setDIDResolver(KeyDidResolver.getResolver())
//                 useIdentityProvider(OrbitDBIdentityProviderDID)
//                 const didProvider = new Ed25519Provider(this.identitySeed)
//                 this.identityProvider = OrbitDBIdentityProviderDID({ didProvider })
//             } catch (error: any) {
//                 logger({
//                     level: LogLevel.ERROR,
//                     component: Component.ORBITDB,
//                     code: ResponseCode.INTERNAL_SERVER_ERROR,
//                     message: `Error creating DID identity provider: ${error}`
//                 })
//             }
//         }
//         logger({
//             level: LogLevel.INFO,
//             component: Component.ORBITDB,
//             message: `Options: ${JSON.stringify({
//                 enableDID: this.enableDID,
//                 databaseName: this.databaseName,
//                 databaseType: this.databaseType
//             })}`,
//         })
//     }
// }

// export {
//     IWorkerOptions,
//     WorkerOptions,
//     DefaultWorkerOptions,
//     OrbitDbWorkerOptions
// }
