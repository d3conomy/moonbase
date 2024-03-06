// import { execute } from "../db/command";
// import { LunarPod } from "../db/pod";
// import { expect } from "chai";

// describe("execute", () => {
//     let pod: LunarPod;

//     beforeEach(() => {
//         pod = new LunarPod();
//     });

//     it("should return the correct result for the 'create' command", () => {
//         const command = "connection";
//         const payload = { name: "Pod 1" };
//         const expectedResult = { success: true };

//         const result = execute({ pod, command, args: payload });

//         expect(result).to.deep.equal(expectedResult);
//     });

//     it("should return the correct result for the 'update' command", () => {
//         const command = "update";
//         const payload = { id: 1, name: "Updated Pod" };
//         const expectedResult = { success: true };

//         const result = execute({ pod, command, args: payload });

//         expect(result).to.deep.equal(expectedResult);
//     });

//     it("should return the correct result for the 'delete' command", () => {
//         const command = "delete";
//         const payload = { id: 1 };
//         const expectedResult = { success: true };

//         const result = execute({ pod, command, args: payload });

//         expect(result).to.deep.equal(expectedResult);
//     });

//     it("should return the correct result for the 'get' command", () => {
//         const command = "get";
//         const payload = { id: 1 };
//         const expectedResult = { success: true, data: { id: 1, name: "Pod 1" } };

//         const result = execute({ pod, command, args: payload });

//         expect(result).to.deep.equal(expectedResult);
//     });

//     it("should return the correct result for the 'list' command", () => {
//         const command = "list";
//         const expectedResult = { success: true, data: [{ id: 1, name: "Pod 1" }] };

//         const result = execute({ pod, command });

//         expect(result).to.deep.equal(expectedResult);
//     });
// });

// describe("execute", () => {
//     it("should return the correct result for each command", () => {
//         // Test case 1: Command "create"
//         const createCommand = {
//             command: "create",
//             payload: { name: "Pod 1" },
//         };
//         const createResult = execute(createCommand);
//         expect(createResult).to.deep.equal({ success: true });

//         // Test case 2: Command "update"
//         const updateCommand = {
//             command: "update",
//             payload: { id: 1, name: "Updated Pod" },
//         };
//         const updateResult = execute(updateCommand);
//         expect(updateResult).to.deep.equal({ success: true });

//         // Test case 3: Command "delete"
//         const deleteCommand = {
//             command: "delete",
//             payload: { id: 1 },
//         };
//         const deleteResult = execute(deleteCommand);
//         expect(deleteResult).to.deep.equal({ success: true });

//         // Test case 4: Command "get"
//         const getCommand = {
//             command: "get",
//             payload: { id: 1 },
//         };
//         const getResult = execute(getCommand);
//         expect(getResult).to.deep.equal({ success: true, data: { id: 1, name: "Pod 1" } });

//         // Test case 5: Command "list"
//         const listCommand = {
//             command: "list",
//         };
//         const listResult = execute(listCommand);
//         expect(listResult).to.deep.equal({ success: true, data: [{ id: 1, name: "Pod 1" }] });
//     });
// });
