import { expect } from 'chai';
import { createLibp2pProcessOptions, Libp2pProcessConfig } from '../src/libp2p-process/processConfig.js';

describe('createLibp2pProcessOptions', () => {
    it('should return a valid Libp2pOptions object', () => {
        const config: Libp2pProcessConfig = new Libp2pProcessConfig();
        const options = createLibp2pProcessOptions(config);
        
        expect(options).to.be.an('object');
        expect(options.start).to.equal(config.autoStart);
        // Add more assertions for other properties
    });
});

describe('Libp2pProcessConfig', () => {
    it('should have default values', () => {
        const config: Libp2pProcessConfig = new Libp2pProcessConfig();
        
        expect(config.autoStart).to.be.false;
        // Add more assertions for other properties
    });
});