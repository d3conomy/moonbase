import { multiaddr } from "@multiformats/multiaddr";
import { setListenAddresses, listenAddressesConfig } from "../libp2p-process/addresses.js";
import { expect } from "chai";
describe("setListenAddresses", () => {
    it("should return an object with listen addresses", () => {
        const multiaddrs = [
            multiaddr("/ip4/127.0.0.1/tcp/8080"),
            multiaddr("/ip6/::1/tcp/8080"),
        ];
        const result = setListenAddresses(multiaddrs);
        expect(result).to.equal({
            listen: [
                "/ip4/127.0.0.1/tcp/8080",
                "/ip6/::1/tcp/8080",
            ],
        });
    });
});
describe("listenAddressesConfig", () => {
    it("should return an object with listen addresses", () => {
        const result = listenAddressesConfig({
            enableTcp: true,
            tcpPort: 8080,
            enableIp4: true,
            ip4Domain: "127.0.0.1",
            enableIp6: true,
            ip6Domain: "::1",
        });
        expect(result).to.equal({
            listen: [
                "/ip4/127.0.0.1/tcp/8080",
                "/ip6/::1/tcp/8080",
            ],
        });
    });
});
