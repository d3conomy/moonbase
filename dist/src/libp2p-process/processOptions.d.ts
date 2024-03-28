import { Libp2pOptions } from "libp2p";
import { Libp2pProcessConfig } from "./processConfig.js";
import { PeerId } from "@libp2p/interface";
declare class Libp2pProcessOptions {
    processOptions?: Libp2pOptions;
    processConfig?: Libp2pProcessConfig;
    peerId?: string | PeerId;
    constructor({ processOptions, processConfig, peerId }?: {
        processConfig?: Libp2pProcessConfig;
        processOptions?: Libp2pOptions;
        peerId?: string | PeerId;
    });
    init(): Promise<void>;
}
declare const libp2pProcessOptions: ({ processOptions, processConfig, peerId }?: {
    processOptions?: Libp2pOptions | undefined;
    processConfig?: Libp2pProcessConfig | undefined;
    peerId?: string | PeerId | undefined;
}) => Promise<Libp2pProcessOptions>;
export { Libp2pProcessOptions, libp2pProcessOptions };
//# sourceMappingURL=processOptions.d.ts.map