import { noise } from '@chainsafe/libp2p-noise';
const connectionEncryption = ({ enableNoise } = {}) => {
    let connectionEncryption = new Array();
    if (enableNoise) {
        connectionEncryption.push(noise());
    }
    return connectionEncryption;
};
export { connectionEncryption };
