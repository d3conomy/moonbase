import { Libp2pOptions } from "libp2p";
import { Libp2pProcessConfig } from "./processConfig.js";
import { PeerId } from "@libp2p/interface";
declare class Libp2pProcessOptions {
    processOptions: Libp2pOptions;
    processConfig?: Libp2pProcessConfig;
    peerId?: string | PeerId;
    constructor({ processOptions, processConfig, peerId }?: {
        processConfig?: Libp2pProcessConfig;
        processOptions?: Libp2pOptions;
        peerId?: string | PeerId;
    });
}
export { Libp2pProcessOptions };
//# sourceMappingURL=processOptions.d.ts.map