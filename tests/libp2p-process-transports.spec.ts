import { expect } from 'chai';
import { transports } from '../src/libp2p-process/transports.js';

describe('transports', () => {
    it('should return an array of transport options', () => {
        const result = transports();
        expect(result).to.be.an('array');
    });

    it('should include webSockets transport if enableWebSockets is true', () => {
        const result = transports({ enableWebSockets: true });
        expect(result).to.be.an('Array').with.lengthOf(4);
    });

    it('should include webTransport transport if enableWebTransport is true', () => {
        const result = transports({ enableWebTransport: true });
        expect(result).to.be.an('Array').with.lengthOf(4);
    });

    it('should include tcp transport if enableTcp is true', () => {
        const result = transports({ enableTcp: true });
        expect(result).to.be.an('Array').with.lengthOf(4);
    });

    it('should include webRTC transport if enableWebRTC is true', () => {
        const result = transports({ enableWebRTC: true });
        expect(result).to.be.an('Array').with.lengthOf(5);
    });

    it('should include circuitRelayTransport if enableCircuitRelayTransport is true', () => {
        const result = transports({ enableCircuitRelayTransport: true });
        expect(result).to.be.an('Array').with.lengthOf(4);
    });

    it('should include circuitRelayTransport with discoverRelays option if enableCircuitRelayTransportDiscoverRelays is provided', () => {
        const discoverRelays = 2;
        const result = transports({ enableCircuitRelayTransportDiscoverRelays: discoverRelays });
        expect(result).to.be.an('Array').with.lengthOf(4);
    });
});
