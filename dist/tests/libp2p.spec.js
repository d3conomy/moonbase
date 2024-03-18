import { Libp2pProcess, _Libp2pOptions, createLibp2pProcess, defaultLibp2pOptions } from '../db/libp2p.js';
import { expect } from 'chai';
describe('Libp2p::createLibp2pProcess', () => {
    let libp2pProcess;
    let libp2pProcess2;
    beforeEach(async () => {
        // Add any setup code here
        libp2pProcess = await createLibp2pProcess();
    });
    it('should create a Libp2p Process with default options', async () => {
        // libp2pProcess = await createLibp2pProcess();
        expect(libp2pProcess.peerId.toString()).to.be.a('string');
        // Add more assertions to validate the created Libp2p node
    });
    it('should create two simultaneous Libp2p Processes', async () => {
        libp2pProcess2 = await createLibp2pProcess();
        expect(libp2pProcess2.peerId.toString()).to.not.equal(libp2pProcess.peerId.toString());
        // Add more assertions to validate the second created Libp2p node
    });
    afterEach(async () => {
        // Add any cleanup code here
        await libp2pProcess.stop();
        await libp2pProcess2?.stop();
    });
});
describe('Libp2p::defaultLibp2pOptions', () => {
    it('should have default options', () => {
        const options = defaultLibp2pOptions();
        expect(options).to.be.an('Object');
        // Add more assertions to validate the default options
    });
    it('shoulld have default start property of false', () => {
        const options = defaultLibp2pOptions();
        expect(options.start).to.be.false;
        // Add more assertions to validate the default options
    });
});
describe('Libp2p::_Libp2pOptions', () => {
    it('should have default options', () => {
        const options = new _Libp2pOptions();
        expect(options.processOptions).to.be.an('Object');
        expect(options.start).to.be.false;
    });
});
describe('Libp2p::Libp2pProcess', () => {
    it('should have default options', () => {
        const process = new Libp2pProcess();
        expect(process.options).to.be.undefined;
        expect(process.process).to.be.undefined;
    });
    it('should init and create a Libp2p Process with default options', async () => {
        const process = new Libp2pProcess();
        await process.init();
        expect(process.process).to.not.be.undefined;
        expect(process.process?.peerId.toString()).to.be.a('string');
    });
    it('should start after init', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(process.process?.status).to.not.be.equal('stopped' || "stopping");
        await process.stop();
    });
    it('should get the multiaddrs after start', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(process.getMultiaddrs).to.not.be.undefined;
        await process.stop();
    });
    it('should get the peers', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(process.peers()).to.not.be.undefined;
        await process.stop();
    });
    it('should make some connections', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(process.connections()).to.not.be.undefined;
        await process.stop();
    });
    it('should get the protocols', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(process.getProtocols()).to.not.be.undefined;
        await process.stop();
    });
    it('should dial a peer', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(await process.dial("/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ")).to.not.be.undefined;
        await process.stop();
    });
    it('should dial a protocol after start', async () => {
        const process = new Libp2pProcess();
        await process.init();
        await process.start();
        expect(await process.dialProtocol("/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ", "/libp2p/circuit/relay/0.2.0/hop")).to.not.be.undefined;
        await process.stop();
    });
});