import { expect } from 'chai';
import { libp2pServices } from '../src/libp2p-process/services.js';
describe('libp2pServices', () => {
    it('should return an empty object when no options are provided', () => {
        const result = libp2pServices();
        console.log(result);
        expect(result).to.be.instanceOf(Object);
    });
    it('should enable GossipSub when enableGossipSub option is true', () => {
        const result = libp2pServices({ enableGossipSub: true });
        console.log(result);
        expect(result).to.deep.hasOwnProperty('pubsub');
    });
    it('should enable AutoNAT when enableAutoNAT option is true', () => {
        const result = libp2pServices({ enableAutoNAT: true });
        expect(result).to.deep.hasOwnProperty('autonat');
    });
    it('should enable Identify when enableIdentify option is true', () => {
        const result = libp2pServices({ enableIdentify: true });
        expect(result).to.deep.hasOwnProperty('identify');
    });
    it('should enable UPnPNAT when enableUPnPNAT option is true', () => {
        const result = libp2pServices({ enableUPnPNAT: true });
        expect(result).to.deep.hasOwnProperty('upnpNAT');
    });
    it('should enable GossipSub and AutoNAT when both options are true', () => {
        const result = libp2pServices({ enableGossipSub: true, enableAutoNAT: true });
        expect(result).to.deep.hasOwnProperty('pubsub');
        expect(result).to.deep.hasOwnProperty('autonat');
    });
    it('should enable GossipSub and Identify when both options are true', () => {
        const result = libp2pServices({ enableGossipSub: true, enableIdentify: true });
        expect(result).to.deep.hasOwnProperty('pubsub');
        expect(result).to.deep.hasOwnProperty('identify');
    });
    it('should enable GossipSub and UPnPNAT when both options are true', () => {
        const result = libp2pServices({ enableGossipSub: true, enableUPnPNAT: true });
        expect(result).to.deep.hasOwnProperty('pubsub');
        expect(result).to.deep.hasOwnProperty('upnpNAT');
    });
    it('should enable AutoNAT and Identify when both options are true', () => {
        const result = libp2pServices({ enableAutoNAT: true, enableIdentify: true });
        expect(result).to.deep.hasOwnProperty('autonat');
        expect(result).to.deep.hasOwnProperty('identify');
    });
    it('should enable AutoNAT and UPnPNAT when both options are true', () => {
        const result = libp2pServices({ enableAutoNAT: true, enableUPnPNAT: true });
        expect(result).to.deep.hasOwnProperty('autonat');
        expect(result).to.deep.hasOwnProperty('upnpNAT');
    });
    it('should enable Identify and UPnPNAT when both options are true', () => {
        const result = libp2pServices({ enableIdentify: true, enableUPnPNAT: true });
        expect(result).to.deep.hasOwnProperty('identify');
        expect(result).to.deep.hasOwnProperty('upnpNAT');
    });
    it('should enable GossipSub, AutoNAT and Identify when all options are true', () => {
        const result = libp2pServices({ enableGossipSub: true, enableAutoNAT: true, enableIdentify: true });
        expect(result).to.deep.hasOwnProperty('pubsub');
        expect(result).to.deep.hasOwnProperty('autonat');
        expect(result).to.deep.hasOwnProperty('identify');
    });
    it('should enable Ping when enablePing option is true', () => {
        const result = libp2pServices({ enablePing: true });
        expect(result).to.deep.hasOwnProperty('ping');
    });
    it('should enable DCUTR when enableDCUTR option is true', () => {
        const result = libp2pServices({ enableDCUTR: true });
        expect(result).to.deep.hasOwnProperty('dcutr');
    });
    it('should enable Relay when enableRelay option is true', () => {
        const result = libp2pServices({ enableRelay: true });
        expect(result).to.deep.hasOwnProperty('relay');
    });
    it('should enable DHT when enableDHT option is true', () => {
        const result = libp2pServices({ enableDHT: true });
        expect(result).to.deep.hasOwnProperty('dht');
    });
    it('should enable DHTClient when enableDHTClient option is true', () => {
        const result = libp2pServices({ enableDHTClient: true });
        expect(result).to.deep.hasOwnProperty('dhtClient');
    });
});
