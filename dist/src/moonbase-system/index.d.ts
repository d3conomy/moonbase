/// <reference types="node" />
/// <reference types="node" />
import os from 'os';
declare const systemInfo: {
    platform: NodeJS.Platform;
    arch: string;
    cpus: os.CpuInfo[];
    totalMemory: number;
    freeMemory: number;
};
export { systemInfo };
//# sourceMappingURL=index.d.ts.map