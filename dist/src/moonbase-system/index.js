import os from 'os';
// Analyze the system
const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
};
export { systemInfo };
