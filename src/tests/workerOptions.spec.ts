import { expect } from 'chai';

import { WorkerOptions, DefaultWorkerOptions } from '../db/workerOptions';
import { Component } from '../utils';

describe('WorkerOptions', () => {
    describe('DefaultWorkerOptions', () => {
        it('should create an instance with the provided options', () => {
            const options = {
                type: Component.SYSTEM,
                workerId: 'worker1',
                process: 'WorkerProcess',

                dependencies: ['Dependency1', 'Dependency2'],
            };

            const workerOptions = new DefaultWorkerOptions(options);

            expect(workerOptions.type).equal(options.type);
            expect(workerOptions.workerId).equal(options.workerId);
            expect(workerOptions.process).equal(options.process);
            expect(workerOptions.processOptions).equal(options.processOptions);
            expect(workerOptions.dependencies).equal(options.dependencies);
        });

    });
});
