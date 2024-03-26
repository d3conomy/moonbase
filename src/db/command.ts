import { OpenDb, _OpenDbOptions } from "./open.js"
import { LunarPod } from "./pod.js"

/**
 * Executes a command on a pod
 * @category Pod
 * @example
 * const result = await execute({
 *   pod: pod,
 *   command: 'connections',
 *   args: { peerId: 'zdpuAqzv3...' }
 * })
 * console.log(result) // [{ peerId: 'zdpuAqzv3...', direction: 'inbound', ... }]
 */
const execute = async ({
    pod,
    command,
    args
}: {
    pod: LunarPod,
    command: string,
    args?: any
}): Promise<any> => {

    let output: any = "Command Timed Out"

    try {
        switch (command) {
            case 'status':
                if(pod.libp2p) {
                    return pod.status()
                }
            case 'connections':
                if(pod.libp2p) {
                    return pod.libp2p.connections(args?.peerId)
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'multiaddrs':
                if(pod.libp2p) {
                    return pod.libp2p.getMultiaddrs()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'peerid':
                if(pod.libp2p) {
                    return pod.libp2p.peerId()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'peers':
                if(pod.libp2p) {
                    return pod.libp2p.peers()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'protocols':
                if(pod.libp2p) {
                    return pod.libp2p.getProtocols()
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'dial':
                if(pod.libp2p) {
                    return await pod.libp2p.dial(args?.address)
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'dialprotocol':
                if (pod.libp2p) {
                    return await pod.libp2p.dialProtocol(args.address, args.protocol);
                }
                else {
                    throw new Error('Libp2p component not available')
                }
            case 'addjson':
                if (pod.ipfs !== undefined ) {
                    return await pod.ipfs.addJson(args.data);
                }
                else {
                    throw new Error('IPFS component not available');
                }
            case 'getjson':
                if (pod.ipfs !== undefined) {
                    return await pod.ipfs.getJson(args.cid);
                }
                else {
                    throw new Error('IPFS component not available');
                }
            default:
                throw new Error('Command not found');
        };
    }
    catch (e: any) {
        return {
            message: `Command failed`,
            podId: pod.id,
            command: command,
            error: e.message
        }
    }
}

/**
 * Executes an operation on an open database
 * @category Database
 * @example
 * const result = await operation({
 *    openDb: openDb,
 *    command: 'add',
 *    args: { value: { name: 'Alice' } }
 * })
 * console.log(result) // 'zdpuAqzv3...'
 */
const operation = async ({
    openDb,
    command,
    args
}: {
    openDb: OpenDb,
    command: string,
    args?: any
}): Promise<any> => {

    try {
        switch (command) {
            case 'add':
                return await openDb.add(args.value)
            case 'put':
                return await openDb.put(args.key, args.value)
            case 'get':
                return await openDb.get(args.key)
            case 'del':
                return await openDb.del(args.key)
            case 'all':
                return await openDb.all()
            case 'query':
                return await openDb.query(args.query)
            default:
                throw new Error('Command not found');
        };
    }
    catch (e: any) {
        return {
            message: `Command failed`,
            dbId: openDb.id,
            command: command,
            error: e.message
        }
    }
}

export {
    execute,
    operation
}