import OrbitDBIdentityProviderDID from '@orbitdb/identity-provider-did';

import {
    Libp2pOptions
} from 'libp2p';


import {
    createRandomId,
    logger
} from '../utils/index.js';

import {
    Component,
    LogLevel,
    ResponseCode
} from '../utils/constants.js';

import {
    IWorker,
    Worker,
    WorkerProcess
} from './worker.js';
import { defaultLibp2pOptions } from './workerSetupLibp2p.js';
import { MemoryBlockstore } from 'blockstore-core';
import { MemoryDatastore } from 'datastore-core';

type WorkerProcessOptions = ILibp2pWorkerOptions | IIPFSWorkerOptions | IOrbitDbWorkerOptions | IOpenDbWorkerOptions;

interface ILibp2pWorkerOptions
{
    libp2pOptions?: Libp2pOptions;
}

interface IIPFSWorkerOptions
{
    blockstore?: any;
    datastore?: any;
}  

interface IOrbitDbWorkerOptions
{
    enableDID?: boolean;
    identitySeed?: Uint8Array;
    identityProvider?: typeof OrbitDBIdentityProviderDID;
}

interface IOpenDbWorkerOptions
{
    databaseName: string;
    databaseType: string;
}

/**
 * @interface IWorkerOptions
 * @description The Worker Options Interface
 * @member type: Component - The component type
 * @member workerId?: string - The System Worker ID of the worker
 * @member process?: WorkerProcess - The worker process
 * @member processOptions?: WorkerOptions - The worker process options
 * @member dependencies?: Array<IWorker> - The worker dependencies
 */
interface IWorkerOptions {
    type: Component;
    workerId: string;
    process?: WorkerProcess;
    processOptions?: WorkerProcessOptions;
    dependencies?: Array<IWorker>;
}

class WorkerOptions
    implements IWorkerOptions
{
    public type: Component;
    public workerId: string;
    public process?: WorkerProcess;
    public processOptions?: WorkerProcessOptions;
    public dependencies?: Array<Worker>;

    public constructor({
        type,
        workerId,
        process,
        processOptions,
        dependencies
    }: {
        type: Component,
        workerId?: string,
        process?: WorkerProcess,
        processOptions?: WorkerProcessOptions,
        dependencies?: Array<Worker>
    }) {
        this.type = type;
        this.workerId = workerId ? workerId : createRandomId();
        this.process = process;
        this.processOptions = processOptions;
        this.dependencies = dependencies;

        this.checkProcess();
    }

    private checkProcess(): void {
        if (this.process && this.processOptions) {
            logger({
                level: LogLevel.WARN,
                component: Component.SYSTEM,
                message: `WorkerOptions: ${this.workerId} has both process and processOptions defined.` +
                         `Defaults to using the defined process.  Removing processOptions to avoid conflicts.`
            });
            this.processOptions = undefined;
        }

        if (!this.process && !this.processOptions) {
            logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                message: `WorkerOptions: ${this.workerId} has no process or processOptions defined.` +
                         `Defaults to the default worker options.`
            });
            this.processOptions = this.getDefaults().options;
            this.verifyDependencies();
        }

        if (this.processOptions) {
            this.verifyDependencies();
        }
    }
    
    private getDefaults(): {
        dependencies: Array<Component>,
        options?: WorkerProcessOptions
    } {
        let options: WorkerProcessOptions | undefined = undefined;
        let dependencies: Array<Component> = new Array<Component>();
        switch (this.type) {
            case Component.LIBP2P:
                options = {
                    libp2pOptions: defaultLibp2pOptions
                } as ILibp2pWorkerOptions;
                break;
            case Component.IPFS:
                options = {
                    blockstore: new MemoryBlockstore(),
                    datastore: new MemoryDatastore()
                } as IIPFSWorkerOptions;
                dependencies.push(Component.LIBP2P);
                break;
            case Component.ORBITDB:
                options = {
                    enableDID: true
                } as IOrbitDbWorkerOptions;
                dependencies.push(Component.LIBP2P);
                dependencies.push(Component.IPFS);
                break;
            case Component.DB:
                const databaseType: string = 'events';
                options = {
                    databaseType,
                    databaseName: `db-${this.workerId}-${databaseType}`,

                } as IOpenDbWorkerOptions;
                dependencies.push(Component.LIBP2P);
                dependencies.push(Component.IPFS);
                dependencies.push(Component.ORBITDB);
                break;
            default:
                logger({
                    level: LogLevel.WARN,
                    component: Component.SYSTEM,
                    message: `WorkerOptions: ${this.workerId} has an invalid type: ${this.type}.`
                });
                break;
        }
        return {
            dependencies,
            options
        };
    }

    private verifyDependencies(): void {
        let defaultDependencies: Array<Component> = this.getDefaults().dependencies;
        let verified: Array<Worker> = new Array<Worker>();

        this.dependencies?.forEach((dependency: Worker) => {
            if (defaultDependencies.includes(dependency.type) &&
                dependency.workerId !== this.workerId
            ) {
                verified.push(dependency);
            }
            else {
                logger({
                    level: LogLevel.WARN,
                    component: Component.SYSTEM,
                    message: `WorkerOptions: ${this.workerId} has an invalid dependency: ${dependency.workerId}.`
                });
            }
        });

        this.dependencies = verified;

        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            workerId: this.workerId,
            message: `WorkerOptions: Worker has verified dependencies.`
        });
    }
}

export {
    IWorkerOptions,
    ILibp2pWorkerOptions,
    IIPFSWorkerOptions,
    IOrbitDbWorkerOptions,
    IOpenDbWorkerOptions,
    WorkerProcessOptions,
    WorkerOptions,
}
