import { Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { setListenAddresses, listenAddressesConfig } from "../src/libp2p-process/addresses.js";
import { expect } from "chai";

describe("setListenAddresses", () => {
    it("should return an object with listen addresses", () => {
        const multiaddrs: Array<Multiaddr> = [
            multiaddr("/ip4/127.0.0.1/tcp/8080"),
            multiaddr("/ip6/::1/tcp/8080"),
        ];

        const result = setListenAddresses(multiaddrs);

        expect(result).to.deep.equal({
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

        expect(result).to.deep.equal({
            listen: [
                "/ip4/127.0.0.1/tcp/8080",
                "/ip6/::1/tcp/8080",
            ],
        });
    });

    it("should return an object with listen addresses with all values enabled", () => {
        const result = listenAddressesConfig({
            ip4Domain: "0.0.0.0",
            tcpPort: 0,
            udpPort: 0,
            ip6Domain: "::",
            enableTcp: true,
            enableIp4: true,
            enableIp6: true,
            enableQuicv1: true,
            enableWebTransport: true,
            enableWebSockets: true,
            enableWebRTC: true,
            enableWebRTCStar: true,
            webRTCStarAddress: "/dns4/webrtc-star.trnk.xyz/tcp/443/wss/p2p-webrtc-star",
            enableCircuitRelayTransport: true,
        });
        console.log(result);
        expect(result).to.deep.equal({
            listen: [
                "/ip4/0.0.0.0/tcp/0",
                "/ip4/0.0.0.0/udp/0/quic-v1",
                "/ip4/0.0.0.0/tcp/0/ws/",
                "/ip6/::/tcp/0",
                "/ip6/::/udp/0/quic-v1",
                "/ip6/::/tcp/0/ws/",
                "/webrtc",
                "/dns4/webrtc-star.trnk.xyz/tcp/443/wss/p2p-webrtc-star"
            ],
        });
    });
});
