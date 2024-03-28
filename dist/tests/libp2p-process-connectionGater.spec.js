import { expect } from 'chai';
import { connectionGater } from '../src/libp2p-process/connectionGater.js';
describe('connectionGater', () => {
    it('should return an empty map when enableDenyDialMultiaddr is false', () => {
        const options = {
            enableDenyDialMultiaddr: false,
            denyDialMultiaddr: false
        };
        const result = connectionGater(options);
        expect(result.size).to.equal(0);
    });
    it('should return a map with "denyDialMultiaddr" key when enableDenyDialMultiaddr is true', () => {
        const options = {
            enableDenyDialMultiaddr: true,
            denyDialMultiaddr: false
        };
        const result = connectionGater(options);
        expect(result.size).to.equal(1);
        expect(result.has('denyDialMultiaddr')).to.be.true;
    });
    it('should return a map with "denyDialMultiaddr" key and correct value when enableDenyDialMultiaddr is true', async () => {
        const options = {
            enableDenyDialMultiaddr: true,
            denyDialMultiaddr: true
        };
        const result = connectionGater(options);
        const denyDialMultiaddrFn = result.get('denyDialMultiaddr');
        expect(result.size).to.equal(1);
        expect(result.has('denyDialMultiaddr')).to.be.true;
        expect(await denyDialMultiaddrFn()).to.be.true;
    });
});
