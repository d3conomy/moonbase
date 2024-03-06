import { Component } from "../utils/index.js"
import { LunarPod } from "./pod.js"


const checkPod = (pod: LunarPod, component: Component): boolean => {
    const components = pod.getComponents();
    components.forEach(c => {
        if (c.id.component === component) {
            return true;
        }
    });
    return false;
}

const execute = async ({
    pod,
    command,
    args
}: {
    pod: LunarPod,
    command: string,
    args?: any
}): Promise<any> => {
    try {
        switch (command) {
            case 'connections':
                if(pod.libp2p) {
                    return pod.libp2p.connections()
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'multiaddrs':
                if(pod.libp2p) {
                    return pod.libp2p.getMultiaddrs()
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'peerid':
                if(pod.libp2p) {
                    return pod.libp2p.peerId()
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'peers':
                if(pod.libp2p) {
                    return pod.libp2p.peers()
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'protocols':
                if(pod.libp2p) {
                    return pod.libp2p.getProtocols()
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'dial':
                if(pod.libp2p) {
                    return await pod.libp2p.dial(args?.address)
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'dialprotocol':
                if (pod.libp2p) {
                    return await pod.libp2p.dialProtocol(args.address, args.protocol);
                }
                else {
                    return new Error('Libp2p component not available')
                }
            case 'addjson':
                if (pod.ipfs) {
                    return await pod.ipfs.addJson(args.data);
                }
                else {
                    return new Error('IPFS component not available');
                }
            case 'getjson':
                if (pod.ipfs) {
                    return await pod.ipfs.getJson(args.cid);
                }
                else {
                    return new Error('IPFS component not available');
                }
            default:
                return new Error('Command not found');
        }
    }
    catch (e: any) {
        return e;
    }
}

export {
    execute
}