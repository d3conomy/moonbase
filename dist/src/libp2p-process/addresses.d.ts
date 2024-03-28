import { Multiaddr } from "@multiformats/multiaddr";
declare const setListenAddresses: (multiaddrs: Array<Multiaddr>) => {
    listen: Array<string>;
};
declare const listenAddresses: ({ enableTcp, tcpPort, enableIp4, ip4Domain, enableUdp, udpPort, enableIp6, ip6Domain, enableQuicv1, enableWebTransport, enableWebSockets, enableWebRTC, enableWebRTCStar, webRTCStarAddress, enableCircuitRelayTransport, additionalMultiaddrs }?: {
    enableTcp?: boolean | undefined;
    tcpPort?: number | undefined;
    enableIp4?: boolean | undefined;
    ip4Domain?: string | undefined;
    enableUdp?: boolean | undefined;
    udpPort?: number | undefined;
    enableIp6?: boolean | undefined;
    ip6Domain?: string | undefined;
    enableQuicv1?: boolean | undefined;
    enableWebTransport?: boolean | undefined;
    enableWebSockets?: boolean | undefined;
    enableWebRTC?: boolean | undefined;
    enableWebRTCStar?: boolean | undefined;
    webRTCStarAddress?: string | Multiaddr | undefined;
    enableCircuitRelayTransport?: boolean | undefined;
    additionalMultiaddrs?: (string | Multiaddr)[] | undefined;
}) => {
    listen: Array<string>;
};
export { setListenAddresses, listenAddresses as listenAddressesConfig };
//# sourceMappingURL=addresses.d.ts.map