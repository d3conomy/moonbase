import { OpenDb } from "../db/open.js";
import { LunarPod } from "../db/pod.js";
/**
 * Executes a command on a pod
 * @category Pod
 * @example
 * const result = await execute({
 *   pod: pod,
 *   command: 'connections',
 *   args: { peerId: 'zdpuAqzv3...' }
 * })
 * console.log(result) // [{ peerId: 'zdpuAqzv3...', direction: 'inbound', ... }]
 */
declare const execute: ({ pod, command, args }: {
    pod: LunarPod;
    command: string;
    args?: any;
}) => Promise<any>;
/**
 * Executes an operation on an open database
 * @category Database
 * @example
 * const result = await operation({
 *    openDb: openDb,
 *    command: 'add',
 *    args: { value: { name: 'Alice' } }
 * })
 * console.log(result) // 'zdpuAqzv3...'
 */
declare const operation: ({ openDb, command, args }: {
    openDb: OpenDb;
    command: string;
    args?: any;
}) => Promise<any>;
export { execute, operation };
//# sourceMappingURL=command.d.ts.map