import { Libp2p } from '@libp2p/interface';
import { expect } from 'chai';

import { Worker, IWorker, WorkerProcess } from '../db/worker.js';
import { Component } from '../utils/index.js';
import { WorkerOptions } from '../db/workerOptions.js';

describe('Worker', () => {
    let worker: Worker;
    let workerOptions = new WorkerOptions({
        type: Component.LIBP2P,
        workerId: 'worker1'
    });

    beforeEach(() => {
        worker = new Worker(workerOptions);
    });

    it('should have the correct type', () => {
        expect(worker.type).equals(Component.LIBP2P);
    });

    it('should have the correct workerId', () => {
        expect(worker.workerId).equals('worker1');
    });

    afterEach(() => {
        worker.process?.stop();
    });

});
