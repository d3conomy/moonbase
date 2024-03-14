import { expect } from "chai"

import { _BaseProcess } from "../db/base.js"
import { LogEntry } from "../utils/logBook.js"

describe("_BaseProcess", () => {
    let baseProcess: _BaseProcess

    beforeEach(() => {
        baseProcess = new _BaseProcess()
    })

    it("should initialize with default values", () => {
        expect(baseProcess.id).to.not.be.undefined
        expect(baseProcess.process).to.be.undefined
        expect(baseProcess.options).to.be.undefined
    })

    it("should check if process exists", () => {
        expect(baseProcess.checkProcess()).to.be.false
    })

    it("should check status", () => {
        expect(baseProcess.checkStatus()).to.equal("error")
    })
})
