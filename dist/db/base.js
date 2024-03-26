import { Component, LogLevel, ProcessStage, isProcessStage } from "../utils/constants.js";
import { IdReference } from "../utils/id.js";
import { logger } from "../utils/logBook.js";
/**
 * Base class for process containers
 * @category Process
 */
class _BaseProcess {
    id;
    process;
    options;
    status = ProcessStage.UNKNOWN;
    constructor({ component, id, process, options } = {}) {
        this.id = id ? id : new IdReference({ component: component ? component : Component.PROCESS });
        this.process = process;
        this.options = options;
        logger({
            level: LogLevel.INFO,
            stage: ProcessStage.NEW,
            message: `Process container ready for init on ${this.id.component}-${this.id.name}`
        });
    }
    /**
     * Check if the process exists
     */
    checkProcess() {
        if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Process not found for ${this.id.component}-${this.id.name}`
            });
            return false;
        }
        return true;
    }
    /**
     * Check the status of the process
     */
    checkStatus() {
        let stage = ProcessStage.UNKNOWN;
        try {
            if (!this.checkProcess()) {
                this.status = ProcessStage.ERROR;
                return stage;
            }
            const status = this.process.status;
            stage = isProcessStage(status);
            if (this.status !== stage) {
                this.status = stage;
                logger({
                    level: LogLevel.INFO,
                    stage: stage,
                    processId: this.id,
                    message: `Process status updated for ${this.id.component}-${this.id.name}: ${stage}`
                });
            }
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                message: `Error checking process status for ${this.id.component}: ${error.message}`,
                error: error
            });
            throw error;
        }
        return stage;
    }
    /**
     * Initialize the process
     */
    async init() {
        return;
    }
    /**
     * Start the process
     */
    async start() {
        if (this.process &&
            this.checkStatus() === "stopped" || "stopping") {
            try {
                await this.process.start();
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: `Error starting process for ${this.id.component}-${this.id.name}: ${error.message}`,
                    error: error
                });
                // throw error
            }
            logger(({
                level: LogLevel.INFO,
                stage: ProcessStage.STARTED,
                processId: this.id,
                message: `Process started for ${this.id.component}-${this.id.name}`
            }));
        }
        else if (this.process &&
            this.checkStatus() === "starting" || "started") {
            logger({
                level: LogLevel.WARN,
                stage: ProcessStage.WARNING,
                processId: this.id,
                message: `Process already starting for ${this.id.component}-${this.id.name}`
            });
        }
        else if (!this.process) {
            logger({
                level: LogLevel.ERROR,
                stage: ProcessStage.ERROR,
                processId: this.id,
                message: `Process not found for ${this.id.component}-${this.id.name}`
            });
            // throw new Error(`Process not found for ${this.id.component}-${this.id.name}`)
        }
    }
    /**
     * Stop the process
     */
    async stop() {
        if (this.process &&
            this.checkStatus() === "started") {
            try {
                await this.process.stop();
            }
            catch (error) {
                logger({
                    level: LogLevel.ERROR,
                    stage: ProcessStage.ERROR,
                    processId: this.id,
                    message: `Error stopping process for ${this.id.component}-${this.id.name}: ${error.message}`,
                    error: error
                });
                throw error;
            }
            logger({
                level: LogLevel.INFO,
                stage: ProcessStage.STOPPED,
                processId: this.id,
                message: `Process stopped for ${this.id.component}-${this.id.name}`
            });
        }
        else if (this.process &&
            this.checkStatus() === "stopping") {
            logger({
                level: LogLevel.WARN,
                stage: ProcessStage.WARNING,
                processId: this.id,
                message: `Process already stopping for ${this.id.component}-${this.id.name}`
            });
        }
    }
    /**
     * Restart the process
     */
    async restart() {
        await this.stop();
        await this.start();
    }
}
export { _BaseProcess };
