/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */
const connectionGater = ({ enableDenyDialMultiaddr = true, denyDialMultiaddr = false }) => {
    let connectionGaters = new Map();
    if (enableDenyDialMultiaddr) {
        connectionGaters.set('denyDialMultiaddr', async () => {
            return enableDenyDialMultiaddr;
        });
    }
    return connectionGaters;
};
export { connectionGater };
