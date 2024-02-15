import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { circuitRelayServer, circuitRelayTransport } from '@libp2p/circuit-relay-v2'
import { dcutr } from '@libp2p/dcutr'
import { identify } from '@libp2p/identify'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { autoNAT } from '@libp2p/autonat'
import { tcp } from '@libp2p/tcp'
import { kadDHT, removePublicAddressesMapper } from '@libp2p/kad-dht'
import { uPnPNAT } from '@libp2p/upnp-nat'
import { webRTC } from '@libp2p/webrtc'
import { bootstrap } from '@libp2p/bootstrap'
import { ipnsValidator } from 'ipns/validator'
import { ipnsSelector } from 'ipns/selector'
import { mdns } from '@libp2p/mdns'
import { mplex } from '@libp2p/mplex'
import { Libp2p, Libp2pOptions, createLibp2p } from 'libp2p'
import { Libp2pStatus } from '@libp2p/interface'

import { ILibp2pWorkerOptions, IWorkerOptions, WorkerOptions, WorkerProcessOptions } from './workerOptions.js'
import { Component, LogLevel, ResponseCode, WorkStatus, logger } from '../utils/index.js'
import { ICommand, ICommandProperties, ICommandResponse } from './command.js'
import { multiaddr } from '@multiformats/multiaddr'
import { WorkerProcessTypes } from './worker.js'


const defaultBootstrapConfig: any = {
    list: [
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
        "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        "/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
    ]
}

const defaultLibp2pOptions: Libp2pOptions = {
    addresses: {
        listen: [
            '/ip4/0.0.0.0/udp/0/',
            '/ip4/0.0.0.0/udp/0/quic-v1',
            '/ip4/0.0.0.0/udp/0/quic-v1/webtransport',
            '/ip4/0.0.0.0/tcp/0/ws/',
            '/ip4/0.0.0.0/tcp/0',
            '/webrtc',
        ],
    },
    transports: [
        webSockets(),
        webTransport(),
        tcp(),
        webRTC(),
        circuitRelayTransport({
            discoverRelays: 2
        }),
    ],
    connectionEncryption: [
        noise()
    ],
    streamMuxers: [
        yamux(),
        mplex()
    ],
    services: {
        pubsub: gossipsub({
            allowPublishToZeroPeers: true
        }),
        autonat: autoNAT(),
        identify: identify(),
        upnpNAT: uPnPNAT(),
        dht: kadDHT({
            clientMode: false,
            validators: {
                ipns: ipnsValidator
            },
            selectors: {
                ipns: ipnsSelector
            }
        }),
        lanDHT: kadDHT({
            protocol: '/ipfs/lan/kad/1.0.0',
            peerInfoMapper: removePublicAddressesMapper,
            clientMode: false
        }),
        relay: circuitRelayServer({
            advertise: true
        }),
        dcutr: dcutr(),
    },
    peerDiscovery: [
        bootstrap(defaultBootstrapConfig),
        mdns(),
    ],
    connectionGater: {
        denyDialMultiaddr: async () => {
            return false
        }
    }
}



interface IWorkerProcess{
    instance?: WorkerProcessTypes
    processOptions?: WorkerProcessOptions
    commands?: Array<ICommandProperties>

    create(
        processOptions?: WorkerProcessOptions
    ): Promise<WorkerProcessTypes>

    execute(
        command: ICommandProperties
    ): Promise<ICommand>
}

class Libp2pWorkerProcess
    implements IWorkerProcess
{
    instance?: Libp2p
    processOptions?: ILibp2pWorkerOptions
    commands?: Array<ICommandProperties>

    constructor({
        instance,
        processOptions,
        commands
    }: {
        instance?: Libp2p,
        processOptions?: ILibp2pWorkerOptions,
        commands?: Array<ICommandProperties>
    }) {
        this.processOptions = processOptions
        this.commands = commands
        let newInstance;

        if (!instance) {
            this.create().then((instance: Libp2p) => {
                newInstance = instance
                logger({
                    level: LogLevel.INFO,
                    component: Component.LIBP2P,
                    message: `Libp2p process created.\n` + 
                            `PeerId: ${this.instance?.peerId.toString()}\n`
                })
                this.instance = instance as Libp2p
            }).catch((error: any) => {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.LIBP2P,
                        message: `Error creating libp2p process: ${error}`
                    });
                });
            // });
        } // @ts-ignore
        // this.instance = instance ? instance : newInstance as Libp2p;
    }

    public async create(
        processOptions?: ILibp2pWorkerOptions
    ): Promise<Libp2p> {
        let options = processOptions ? processOptions : this.processOptions
        let instance = await createLibp2p(options?.libp2pOptions as Libp2pOptions) as Libp2p
        this.commands = libp2pCommands()
        this.instance = instance
        return instance
    }

    async execute(
        command: ICommandProperties
    ): Promise<ICommand> {
        let result: any;
        let responseCode: ResponseCode = ResponseCode.FAILURE;
        if (!this.instance) {
            logger({
                level: LogLevel.ERROR,
                component: Component.LIBP2P,
                message: `Libp2p process not created.`
            });
            return {
                process: command,
                output: result
            } as ICommand;
        }

        switch (command.action) {
            case 'start':
                await this.instance.start();
                result = this.instance.status;
                if (result === 'started' || result === 'starting') {
                    responseCode = ResponseCode.SUCCESS;
                } else {
                    responseCode = ResponseCode.FAILURE;
                }
                break;
            case 'stop':
                await this.instance.stop();
                result = this.instance.status;
                if (result === 'stopped' || result === 'stopping') {
                    responseCode = ResponseCode.SUCCESS;
                } else {
                    responseCode = ResponseCode.FAILURE;
                }
                break;
            case 'dial':
                if (!command.args || command.args.length < 1) {
                    logger({
                        level: LogLevel.ERROR,
                        component: Component.LIBP2P,
                        message: `Dial command requires a multiaddr argument.`
                    });
                    break;
                }
                result = await this.instance.dial(multiaddr(command.args[0]));
                responseCode = ResponseCode.SUCCESS;
                break;
            case 'getPeers':
                result = this.instance.getPeers();
                responseCode = ResponseCode.SUCCESS;
                break;
            case 'peerId':
                result = this.instance.peerId.toString();
                responseCode = ResponseCode.SUCCESS;
                break;
            case 'getStatus':
                result = this.instance.status;
                responseCode = ResponseCode.SUCCESS;
                break;
            default:
                logger({
                    level: LogLevel.ERROR,
                    component: Component.LIBP2P,
                    message: `Command not recognized: ${command.action}`
                });
                break;
        }
        logger({
            level: LogLevel.INFO,
            code: responseCode,
            component: Component.LIBP2P,
            message: `Command: ${command.action} executed.\n` +
                     `Result: ${result.toString()}`
        });
        return {
            process: command,
            output: result
        } as ICommand;
    }

}

// const createLibp2pProcess = (
//     options: ILibp2pWorkerOptions
// ): Libp2p | undefined => {
//     let process: Libp2p | undefined = undefined;
    
//     // return await createLibp2p(options.libp2pOptions as Libp2pOptions)
//     createLibp2p(options.libp2pOptions as Libp2pOptions).then((libp2p: Libp2p) => {
//             logger({
//                 level: LogLevel.INFO,
//                 component: Component.LIBP2P,
//                 message: `Libp2p process created.\n` + 
//                         `PeerId: ${libp2p.peerId.toString()}\n`
//             });
//             return libp2p;
//         }).catch((error: any) => {
//             logger({
//                 level: LogLevel.ERROR,
//                 component: Component.LIBP2P,
//                 message: `Error creating libp2p process: ${error}`
//             });
//         }).finally(() => {
//             return process as Libp2p;
//         });
//     return process
// }

const libp2pCommands = (): Array<ICommandProperties> => {
    let commands: Array<ICommandProperties> = new Array<ICommandProperties>();

    commands.push({
        action: 'start'
    }, {
        action: 'stop'
    }, {
        action: 'dial',
        args: ['peerId']
    }, {
        action: 'getPeers'
    }, {
        action: 'peerId'
    }, {
        action: 'getStatus'
    });

    return commands;
}

// async function executeLibp2pCommand(
//     processId: string,
//     worker: Libp2p,
//     command: ICommandProperties,
//     workerId: string
// ): Promise<ICommand> {
//     let result: any;
//     let responseCode: ResponseCode = ResponseCode.FAILURE;
//     switch (command.action) {
//         case 'start':
//             await worker.start();
//             result = worker.status;
//             if (result === 'started' || result === 'starting') {
//                 responseCode = ResponseCode.SUCCESS;
//             } else {
//                 responseCode = ResponseCode.FAILURE;
//             }
//             break;
//         case 'stop':
//             await worker.stop();
//             result = worker.status;
//             if (result === 'stopped' || result === 'stopping') {
//                 responseCode = ResponseCode.SUCCESS;
//             } else {
//                 responseCode = ResponseCode.FAILURE;
//             }
//             break;
//         case 'dial':
//             if (!command.args || command.args.length < 1) {
//                 logger({
//                     level: LogLevel.ERROR,
//                     component: Component.LIBP2P,
//                     message: `Dial command requires a multiaddr argument.`
//                 });
//                 break;
//             }
//             result = await worker.dial(multiaddr(command.args[0]));
//             responseCode = ResponseCode.SUCCESS;
//             break;
//         case 'getPeers':
//             result = worker.getPeers();
//             responseCode = ResponseCode.SUCCESS;
//             break;
//         case 'peerId':
//             result = worker.peerId.toString();
//             responseCode = ResponseCode.SUCCESS;
//             break;
//         case 'getStatus':
//             result = worker.status;
//             responseCode = ResponseCode.SUCCESS;
//             break;
//         default:
//             logger({
//                 level: LogLevel.ERROR,
//                 component: Component.LIBP2P,
//                 processId: processId,
//                 message: `Command not recognized: ${command.action}`
//             });
//             break;
//     }
//     logger({
//         level: LogLevel.INFO,
//         code: responseCode,
//         component: Component.LIBP2P,
//         workerId: workerId,
//         processId: processId,
//         message: `Command: ${command.action} executed.\n` +
//                  `Result: ${result.toString()}`
//     });
//     return {
//         processId,
//         process: command,
//         output: result
//     } as ICommand;
// }

export {
    defaultLibp2pOptions,
    // createLibp2pProcess,
    libp2pCommands,
    Libp2pWorkerProcess,
    IWorkerProcess
    // executeLibp2pCommand
}