/**
 * Default Connection Gater libp2p options
 * @category Libp2p
 */

const connectionGater = ({
    enableDenyDialMultiaddr = true,
    denyDialMultiaddr = false
}: {
    enableDenyDialMultiaddr: boolean,
    denyDialMultiaddr: boolean
}): any => {
    let connectionGaters: Map<string, any> = new Map<string, any>();
    if (enableDenyDialMultiaddr) {
        connectionGaters.set('denyDialMultiaddr', async () => {
            return enableDenyDialMultiaddr
        })
    }
    return connectionGaters;
}

export {
    connectionGater
}
