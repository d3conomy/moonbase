import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
const streamMuxers = ({ enableYamux = true, enableMplex = false } = {}) => {
    let streamMuxers = new Array();
    if (enableYamux) {
        streamMuxers.push(yamux());
    }
    if (enableMplex) {
        streamMuxers.push(mplex());
    }
    return streamMuxers;
};
export { streamMuxers };
