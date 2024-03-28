import { expect } from 'chai';
import * as index from '../src/libp2p-process/index.js';

describe('Index file exports', () => {
    it('should export listenAddressesConfig', () => {
        expect(index).to.haveOwnProperty('listenAddressesConfig');
    });

    it('should export setListenAddresses', () => {
        expect(index).to.haveOwnProperty('setListenAddresses');
    });

    it('should export bootstrap', () => {
        expect(index).to.haveOwnProperty('libp2pBootstrap');
    });

    it('should export connectionEncryption', () => {
        expect(index).to.haveOwnProperty('connectionEncryption');
    });

    it('should export connectionGater', () => {
        expect(index).to.haveOwnProperty('connectionGater');
    });

    it('should export peerDiscovery', () => {
        expect(index).to.haveOwnProperty('peerDiscovery');
    });

    it('should export peerId', () => {
        expect(index).to.haveOwnProperty('libp2pPeerId');
    });

    it('should export createLibp2pProcess', () => {
        expect(index).to.haveOwnProperty('createLibp2pProcess');
    });

    it('should export Libp2pProcess', () => {
        expect(index).to.haveOwnProperty('Libp2pProcess');
    });

    it('should export createLibp2pProcessOptions', () => {
        expect(index).to.haveOwnProperty('createLibp2pProcessOptions');
    });

    it('should export Libp2pProcessConfig', () => {
        expect(index).to.haveOwnProperty('Libp2pProcessConfig');
    });

    it('should export Libp2pProcessOtions', () => {
        expect(index).to.haveOwnProperty('Libp2pProcessOptions');
    });

    it('should export services', () => {
        expect(index).to.haveOwnProperty('libp2pServices');
    });

    it('should export streamMuxers', () => {
        expect(index).to.haveOwnProperty('streamMuxers');
    });

    it('should export transports', () => {
        expect(index).to.haveOwnProperty('transports');
    });
});
