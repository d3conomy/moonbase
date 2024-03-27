import { circuitRelayTransport } from '@libp2p/circuit-relay-v2';
import { webSockets } from '@libp2p/websockets';
import { webTransport } from '@libp2p/webtransport';
import { tcp } from '@libp2p/tcp';
import { webRTC } from '@libp2p/webrtc';
const transports = ({ enableWebSockets = true, enableWebTransport = true, enableTcp = true, enableWebRTC = false, enableCircuitRelayTransport = true, enableCircuitRelayTransportDiscoverRelays = 2, } = {}) => {
    let transportOptions = Array();
    if (enableWebSockets) {
        transportOptions.push(webSockets());
    }
    if (enableWebTransport) {
        transportOptions.push(webTransport());
    }
    if (enableTcp) {
        transportOptions.push(tcp());
    }
    if (enableWebRTC) {
        transportOptions.push(webRTC());
    }
    if (enableCircuitRelayTransport) {
        if (enableCircuitRelayTransportDiscoverRelays !== undefined &&
            enableCircuitRelayTransportDiscoverRelays !== null &&
            enableCircuitRelayTransportDiscoverRelays > 0) {
            transportOptions.push(circuitRelayTransport({
                discoverRelays: enableCircuitRelayTransportDiscoverRelays
            }));
        }
        else {
            transportOptions.push(circuitRelayTransport());
        }
    }
    return transportOptions;
};
export { transports };
