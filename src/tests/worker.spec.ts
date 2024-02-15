import { Libp2p } from '@libp2p/interface';
import { expect } from 'chai';

import { Worker, IWorker } from '../db/worker.js';
import { Component, LogLevel, logger } from '../utils/index.js';
import { WorkerOptions } from '../db/workerOptions.js';

describe('Worker', () => {

    let workerOptions = new WorkerOptions({
        type: Component.LIBP2P,
        workerId: 'worker100'
    });
    let worker: Worker;

    beforeEach(() => {
        
    });

    it('should have the correct type', () => {
        worker = new Worker(workerOptions);
        expect(worker.type).equals(Component.LIBP2P);
    });

    it('should have the correct workerId', () => {
        worker = new Worker(workerOptions);
        expect(worker.workerId).equals('worker100');
    });

    it('should have an empty process', () => {
        worker = new Worker(workerOptions);
        expect(worker.process).to.be.undefined;
    });

    it('should have a peerId', () => {
        worker = new Worker(workerOptions);
        console.log(worker.execute('peerId'));
        expect(worker.execute('peerId').output?.data).to.be.a('string');
    });

    afterEach(() => {

        worker.execute('stop');
    });

});
