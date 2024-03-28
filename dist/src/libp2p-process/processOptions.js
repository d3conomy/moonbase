import { Libp2pProcessConfig, createLibp2pProcessOptions } from "./processConfig.js";
import { libp2pPeerId } from "./peerId.js";
class Libp2pProcessOptions {
    processOptions;
    processConfig;
    peerId;
    constructor({ processOptions, processConfig, peerId } = {}) {
        this.processConfig = processConfig;
        this.peerId = peerId;
        this.processOptions = processOptions;
    }
    async init() {
        this.peerId = await libp2pPeerId({ id: this.peerId });
        if (!this.processConfig) {
            this.processConfig = new Libp2pProcessConfig({ peerId: this.peerId });
            this.processConfig.peerId = this.peerId;
        }
        if (!this.processOptions && this.processConfig) {
            this.processOptions = createLibp2pProcessOptions(this.processConfig);
        }
    }
}
const libp2pProcessOptions = async ({ processOptions, processConfig, peerId } = {}) => {
    const options = new Libp2pProcessOptions({
        processOptions: processOptions,
        processConfig: processConfig,
        peerId: peerId
    });
    await options.init();
    return options;
};
export { Libp2pProcessOptions, libp2pProcessOptions };
