import { } from '@libp2p/interfaces'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mplex } from '@libp2p/mplex'


const streamMuxers = ({
    enableYamux = true,
    enableMplex = false
} : {
    enableYamux?: boolean,
    enableMplex?: boolean
} = {}) => {
    let streamMuxers: Array<any> = new Array<any>()

    if (enableYamux) {
        streamMuxers.push(yamux())
    }

    if (enableMplex) {
        streamMuxers.push(mplex())
    }

    return streamMuxers
}

export {
    streamMuxers
}