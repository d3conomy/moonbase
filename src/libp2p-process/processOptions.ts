import { Libp2pOptions } from "libp2p";
import { Libp2pProcessConfig, createLibp2pProcessOptions } from "./processConfig.js";
import { PeerId } from "@libp2p/interface";
import { libp2pPeerId } from "./peerId.js";

class Libp2pProcessOptions {
    public processOptions?: Libp2pOptions;
    public processConfig?: Libp2pProcessConfig
    public peerId?: string | PeerId;

    constructor({
        processOptions,
        processConfig,
        peerId
    }: {
        processConfig?: Libp2pProcessConfig
        processOptions?: Libp2pOptions,
        peerId?: string | PeerId
    } = {}) {
        this.processConfig = processConfig;
        this.peerId = peerId;
        this.processOptions = processOptions;
    }

    public async init() {

        this.peerId = await libp2pPeerId({id: this.peerId})

        if ( !this.processConfig ) {
            this.processConfig = new Libp2pProcessConfig({peerId: this.peerId});
            this.processConfig.peerId = this.peerId;
        }

        if ( !this.processOptions && this.processConfig) {               
            this.processOptions = createLibp2pProcessOptions(this.processConfig);
        }
    }
}

const libp2pProcessOptions = async ({
    processOptions,
    processConfig,
    peerId
}: {
    processOptions?: Libp2pOptions,
    processConfig?: Libp2pProcessConfig,
    peerId?: string | PeerId
} = {}): Promise<Libp2pProcessOptions> => {
    const options = new Libp2pProcessOptions({
        processOptions: processOptions,
        processConfig: processConfig,
        peerId: peerId
    });
    await options.init();
    return options;
}

export {
    Libp2pProcessOptions,
    libp2pProcessOptions
}