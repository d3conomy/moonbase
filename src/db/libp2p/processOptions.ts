import { Libp2pOptions } from "libp2p";
import { Libp2pProcessConfig, createLibp2pProcessOptions } from "./processConfig.js";
import { PeerId } from "@libp2p/interface";
import { libp2pPeerId } from "./peerId.js";

class Libp2pProcessOptions {
    public processOptions: Libp2pOptions;
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
        if ( !this.processConfig ) {
            this.processConfig = new Libp2pProcessConfig();
        }

        if (peerId) {
            this.peerId = this.processConfig.peerId = libp2pPeerId({ id: peerId });
        }
        
        this.processOptions = processOptions ? processOptions : createLibp2pProcessOptions(this.processConfig);
    }
}

const libp2pProcessOptions = ({
    processOptions,
    processConfig,
    peerId
}: {
    processOptions?: Libp2pOptions,
    processConfig?: Libp2pProcessConfig,
    peerId?: string | PeerId
} = {}): Libp2pProcessOptions => {
    return new Libp2pProcessOptions({
        processOptions: processOptions,
        processConfig: processConfig,
        peerId: peerId
    });
}

export {
    Libp2pProcessOptions
}