import { Libp2pProcessConfig, createLibp2pProcessOptions } from "./processConfig.js";
import { libp2pPeerId } from "./peerId.js";
class Libp2pProcessOptions {
    processOptions;
    processConfig;
    peerId;
    constructor({ processOptions, processConfig, peerId } = {}) {
        this.processConfig = processConfig;
        if (!this.processConfig) {
            this.processConfig = new Libp2pProcessConfig();
        }
        if (peerId) {
            this.peerId = this.processConfig.peerId = libp2pPeerId({ id: peerId });
        }
        this.processOptions = processOptions ? processOptions : createLibp2pProcessOptions(this.processConfig);
    }
}
const libp2pProcessOptions = ({ processOptions, processConfig, peerId } = {}) => {
    return new Libp2pProcessOptions({
        processOptions: processOptions,
        processConfig: processConfig,
        peerId: peerId
    });
};
export { Libp2pProcessOptions };
