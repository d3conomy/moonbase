import { LogLevel } from "../utils/constants.js";
import { logger } from "../utils/logBook.js";
import { LunarPod } from "./pod.js"

const execute = async ({
    pod,
    command,
    args,
    // timeout = 5000
}: {
    pod: LunarPod,
    command: string,
    args?: any,
    // timeout?: number
}): Promise<any> => {
    // timeout = timeout ? timeout : 5000;

    let output: any = "Command Timed Out"

    try {
        switch (command) {
            case 'connections':
                if(pod.libp2p) {
                    return pod.libp2p.connections(args?.peerId)
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
                    return await pod.libp2p.dial(args?.address)
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'dialprotocol':
                if (pod.libp2p) {
                    return await pod.libp2p.dialProtocol(args.address, args.protocol);
                }
                else {
                    throw new Error('Libp2p component not available')
                }
                break;
            case 'addjson':
                if (pod.ipfs !== undefined ) {
                    return await pod.ipfs.addJson(args.data);
                }
                else {
                    throw new Error('IPFS component not available');
                }
                break;
            case 'getjson':
                if (pod.ipfs !== undefined) {
                    return await pod.ipfs.getJson(args.cid);
                }
                else {
                    throw new Error('IPFS component not available');
                }
                break;
            default:
                throw new Error('Command not found');
        };
        // resolve(output);
    }
    catch (e: any) {
        output = {
            message: `Command failed`,
            podId: pod.id,
            command: command,
            error: e.message
        }
        // reject(e.message); 
    }

    return output
}


export {
    execute
}