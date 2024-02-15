import {
    Libp2p
} from 'libp2p';

import {
    CommandCall,
    // CommandProperties,
} from "./command.js";


const libp2pCommands = ({
    worker,
    commands
}: {
    worker: Libp2p,
    commands?: Array<CommandCall>
}): Array<CommandCall> => {
    
    const baseCommands: Array<CommandCall> = commands ? commands : new Array<CommandCall>(
        new CommandCall({
            action: 'start',
            process: worker.start(),
        }),
        new CommandCall({
            action: 'stop',
            process: worker.stop(),
        }),
        new CommandCall({
            action: 'getConnections',
            process: worker.getConnections(),
        }),
        new CommandCall({
            action: 'getPeerID',
            process: worker.peerId,
        }),
        // new CommandCall({
        //     action: 'dial',
        //     process: worker.dial(),
        //     args: [
        //         'peerId'
        //     ],
        // }),
        // new CommandCall({
        //     action: 'disconnect',
        //     process: worker.hangUp,
        // }),
        new CommandCall({
            action: 'getPeers',
            process: worker.getPeers(),
        })
    );
    return baseCommands;
}

export {
    libp2pCommands
}