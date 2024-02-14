import { expect } from 'chai';

import {
    WorkerOptions
} from '../db/workerOptions.js';

import {
    Component
} from '../utils/constants.js';

describe('WorkerOptions', () => {
    describe('DefaultWorkerOptions:LIBP2P', () => {
        it('should create an instance with the provided options', () => {
            const options = {
                type: Component.LIBP2P,
                workerId: 'worker1',
            };

            const workerOptions = new WorkerOptions(options);

            expect(workerOptions.type).equal(options.type);
            expect(workerOptions.workerId).equal(options.workerId);
        });
    });

    describe('DefaultWorkerOptions:IPFS', () => {
        it('should create an instance with the provided options', () => {
            const options = {
                type: Component.IPFS,
                workerId: 'worker2',
            };

            const workerOptions = new WorkerOptions(options);

            expect(workerOptions.type).equal(options.type);
            expect(workerOptions.workerId).equal(options.workerId);
        });
    });
});
