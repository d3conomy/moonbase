/// <reference path="../../src/typings.d.ts" />
import { OrbitDb, Database } from '@orbitdb/core';
import { IpfsProcess } from './ipfs.js';
import { IdReference } from '../utils/id.js';
import { _BaseProcess, _IBaseProcess } from './base.js';
/**
 * Create an identity provider
 * @category OrbitDb
 * @todo Add support for other identity providers
 * @todo Add support for other identity seeds
 */
declare const createIdentityProvider: ({ identitySeed, identityProvider }: {
    identitySeed?: Uint8Array | undefined;
    identityProvider?: any;
}) => any;
/**
* The options for creating an OrbitDb process
* @category OrbitDb
*/
declare class _OrbitDbOptions {
    ipfs: IpfsProcess;
    enableDID: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: any;
    directory?: string;
    constructor({ ipfs, enableDID, identitySeed, identityProvider, directory }: {
        ipfs?: IpfsProcess;
        enableDID?: boolean;
        identitySeed?: Uint8Array;
        identityProvider?: any;
        directory?: string;
    });
}
/**
 * Create an OrbitDb process
 * @category OrbitDb
 */
declare const createOrbitDbProcess: (options: _OrbitDbOptions) => Promise<typeof OrbitDb>;
/**
 * A class representing an OrbitDb process
 * @category OrbitDb
 */
declare class OrbitDbProcess extends _BaseProcess implements _IBaseProcess {
    process?: typeof OrbitDb;
    options?: _OrbitDbOptions;
    constructor({ id, process, options }: {
        id?: IdReference;
        process?: typeof OrbitDb;
        options?: _OrbitDbOptions;
    });
    /**
     * Initialize the OrbitDb process
     */
    init(): Promise<void>;
    /**
     * Open an OrbitDb database
     */
    open({ databaseName, databaseType, options }: {
        databaseName: string;
        databaseType: string;
        options?: Map<string, string>;
    }): Promise<typeof Database>;
    /**
     * Stop the OrbitDb process
     */
    stop(): Promise<void>;
}
export { _OrbitDbOptions, createIdentityProvider, createOrbitDbProcess, OrbitDbProcess };
//# sourceMappingURL=orbitDb.d.ts.map