// import { execute, operation } from "../db/command";
// import { LunarPod, PodBay } from "../db/index.js";
// import { expect } from "chai";

// describe("Command Tests", () => {
//     let podBay: PodBay;
//     let pod: LunarPod;

//     beforeEach(() => {
//         podBay = new PodBay();
//         pod = podBay.createPod();
//     });

//     afterEach(() => {
//         podBay.destroyPod(pod);
//     });

//     describe("execute", () => {
//         it("should execute a command with arguments", async () => {
//             const result = await execute({
//                 pod,
//                 command: "testCommand",
//                 args: { arg1: "value1", arg2: "value2" },
//             });

//             // Add your assertions here
//             expect(result).to.be.not.undefined;
//             // ...
//         });

//         it("should execute a command without arguments", async () => {
//             const result = await execute({
//                 pod,
//                 command: "testCommand",
//             });

//             // Add your assertions here
//             expect(result).toBeDefined();
//             // ...
//         });
//     });

//     describe("operation", () => {
//         let openDb: any; // Replace with the appropriate type for OpenDb

//         beforeEach(() => {
//             openDb = jest.fn(); // Mock the OpenDb function
//         });

//         it("should perform an operation with arguments", async () => {
//             const result = await operation({
//                 openDb,
//                 command: "testOperation",
//                 args: { arg1: "value1", arg2: "value2" },
//             });

//             // Add your assertions here
//             expect(result).toBeDefined();
//             // ...
//         });

//         it("should perform an operation without arguments", async () => {
//             const result = await operation({
//                 openDb,
//                 command: "testOperation",
//             });

//             // Add your assertions here
//             expect(result).toBeDefined();
//             // ...
//         });
//     });
// });
