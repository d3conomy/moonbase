import { expect } from 'chai';
import { multiaddr } from '@multiformats/multiaddr';
import { peerDiscovery } from '../src/libp2p-process/peerDiscovery.js';
describe('peerDiscovery', () => {
    it('should return an empty array when no options are provided', () => {
        const result = peerDiscovery();
        expect(result).to.be.an('array').that.is.empty;
    });
    it('should return an empty array when enableBootstrap is true', () => {
        const result = peerDiscovery({ enableBootstrap: true });
        expect(result).to.be.an('array').that.is.empty;
    });
    it('should return an array with a bootstrap node when useDefaultBootstrap is true', () => {
        const result = peerDiscovery({ enableBootstrap: true, useDefaultBootstrap: true });
        expect(result).to.be.an('array').that.is.not.empty;
    });
    it('should return an array with a bootstrap node when bootstrapMultiaddrs is provided', () => {
        const result = peerDiscovery({ enableBootstrap: true, bootstrapMultiaddrs: [multiaddr('/ip4/127.0.0.1/tcp/4001/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb')] });
        expect(result).to.be.an('array').that.is.not.empty;
    });
    it('should return an array with an mdns node when enableMDNS is true', () => {
        const result = peerDiscovery({ enableMDNS: true });
        expect(result).to.be.an('array').that.is.not.empty;
    });
    it('should return an array with both a bootstrap and mdns node when both are enabled', () => {
        const result = peerDiscovery({ enableBootstrap: true, enableMDNS: true });
        expect(result).to.be.an('array').that.is.not.empty;
    });
});
