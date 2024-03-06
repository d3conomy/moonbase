import { LunarPod } from "./pod.js"

const execute = async ({
    pod,
    command,
    args
}: {
    pod: LunarPod,
    command: string,
    args?: any
}): Promise<any> => {
    let output: any;
    try {
        switch (command) {
            case 'connections':
                if(pod.libp2p) {
                    output = pod.libp2p.connections()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'multiaddrs':
                if(pod.libp2p) {
                    output = pod.libp2p.getMultiaddrs()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'peerid':
                if(pod.libp2p) {
                    output = pod.libp2p.peerId()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'peers':
                if(pod.libp2p) {
                    output = pod.libp2p.peers()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'protocols':
                if(pod.libp2p) {
                    output = pod.libp2p.getProtocols()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'dial':
                if(pod.libp2p) {
                    output = await pod.libp2p.dial(args?.address)
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'dialprotocol':
                if (pod.libp2p) {
                    output = await pod.libp2p.dialProtocol(args.address, args.protocol);
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'addjson':
                if (pod.ipfs !== undefined ) {
                    output = await pod.ipfs.addJson(args.data);
                }
                else {
                    throw new Error('IPFS component not available');
                }
                break;
            case 'getjson':
                if (pod.ipfs !== undefined) {
                    output = await pod.ipfs.getJson(args.cid);
                }
                else {
                    throw new Error('IPFS component not available');
                }
            default:
                throw new Error('Command not found');
        }
    }
    catch (e: any) {
        output = e
    }

    if (output instanceof Error) {
        return {
            error: output.message
        };
    }

    return output;

}

export {
    execute
}