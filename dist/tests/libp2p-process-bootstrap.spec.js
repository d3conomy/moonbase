import { expect } from 'chai';
import { libp2pBootstrap } from '../src/libp2p-process/bootstrap.js';
import { multiaddr } from '@multiformats/multiaddr';
describe('libp2pBootstrap', () => {
    it('should return an object with a list property', () => {
        const result = libp2pBootstrap();
        expect(result).to.be.an('Function');
    });
    it('should include default bootstrap addresses when defaultConfig is true', () => {
        const result = libp2pBootstrap({ defaultConfig: true, list: true });
        expect(result).to.include.members([
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ"
        ]);
    });
    it('should include additional multiaddrs when provided', () => {
        const result = libp2pBootstrap({
            list: true,
            defaultConfig: false,
            multiaddrs: [
                "/ip4/127.0.0.1/tcp/1234/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                "/ip4/127.0.0.1/tcp/5678/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa"
            ]
        });
        expect(result).to.include.members([
            "/ip4/127.0.0.1/tcp/1234/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/ip4/127.0.0.1/tcp/5678/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa"
        ]);
    });
    it('should convert Multiaddr objects to strings', () => {
        const result = libp2pBootstrap({
            list: true,
            defaultConfig: false,
            multiaddrs: [
                multiaddr("/ip4/127.0.0.1/tcp/1234/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN"),
                multiaddr("/ip4/127.0.0.1/tcp/5678/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa")
            ]
        });
        expect(result).to.include.members([
            "/ip4/127.0.0.1/tcp/1234/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
            "/ip4/127.0.0.1/tcp/5678/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa"
        ]);
    });
});
