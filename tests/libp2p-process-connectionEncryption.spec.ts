import { expect } from 'chai';
import { connectionEncryption } from '../src/libp2p-process/connectionEncryption.js';

describe('connectionEncryption', () => {
    it('should return an empty array when enableNoise is not provided', () => {
        const result = connectionEncryption();
        expect(result).to.be.an('array').that.is.empty;
    });

    it('should return an array with noise() when enableNoise is true', () => {
        const result = connectionEncryption({ enableNoise: true });
        expect(result).to.be.an('array').that.is.not.empty;
    });

    it('should return an empty array when enableNoise is false', () => {
        const result = connectionEncryption({ enableNoise: false });
        expect(result).to.be.an('array').that.is.empty;
    });
});
