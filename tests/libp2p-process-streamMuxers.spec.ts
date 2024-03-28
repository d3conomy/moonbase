import { expect } from 'chai';
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'

import { streamMuxers } from '../src/libp2p-process/streamMuxers.js';

describe('streamMuxers', () => {
    it('should return an default array when no options are provided', () => {
        const result = streamMuxers();
        expect(result).to.be.an('array').that.is.lengthOf(1);
    });

    it('should include yamux when enableYamux is true', () => {
        const result = streamMuxers({ enableYamux: true });
        expect(result).to.be.an('array').that.is.lengthOf(1);
    });

    it('should include mplex when enableMplex is true', () => {
        const result = streamMuxers({ enableMplex: true });
        expect(result).to.be.an('array').that.is.lengthOf(2);
    });

    it('should include both yamux and mplex when both options are true', () => {
        const result = streamMuxers({ enableYamux: true, enableMplex: true });
        expect(result).to.be.an('array').that.is.lengthOf(2);
    });
});
