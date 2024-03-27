
import { noise } from '@chainsafe/libp2p-noise'

const connectionEncryption = ({
    enableNoise
}: {
    enableNoise?: boolean
} = {}) => {
    let connectionEncryption: Array<any> = new Array<any>();
    if (enableNoise) {
        connectionEncryption.push(noise())
    }
    return connectionEncryption; 
}

export {
    connectionEncryption
}