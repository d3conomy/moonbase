import { Component, ResponseCode, LogLevel } from './constants.js';
class LogEntry {
    level;
    code;
    timestamp;
    message;
    workerId;
    processId;
    constructor({ message, level, code, workerId, processId, }) {
        this.level = level ? level : LogLevel.INFO;
        this.code = code ? code : ResponseCode.UNKNOWN;
        this.timestamp = new Date();
        this.message = message;
        this.workerId = workerId;
        this.processId = processId;
    }
}
/**
 * @class LogBook
 * @implements ILogBook
 * @description A class to manage an individual log book
 */
class LogBook {
    name;
    history;
    constructor(name) {
        this.name = name;
        this.history = new Map();
    }
    /**
     * @function add
     * @param entry : ILogEntry - The entry to add to the log book
     * @returns void
     * @description Adds an entry to the log book
     */
    add(entry) {
        const counter = this.history.size + 1;
        this.history.set(counter, entry);
    }
    /**
     * @function get
     * @param entryId : number - The id of the entry to get
     * @returns ILogEntry - The entry
     * @description Gets an entry from the log book
     */
    get(entryId) {
        const entry = this.history.get(entryId);
        if (entry) {
            return entry;
        }
        else {
            throw new Error("Entry not found");
        }
    }
    /**
     * @function delete
     * @param entryId : number - The id of the entry to delete
     * @returns void
     * @description Deletes an entry from the log book
     */
    delete(entryId) {
        this.history.delete(entryId);
    }
    /**
     * @function getAll
     * @returns Map<number, ILogEntry> - A map of all the entries
     * @description Returns a map of all the entries
     */
    getAll() {
        return this.history;
    }
    /**
     * @function clear
     * @returns void
     * @description Clears the entire log book
     */
    clear() {
        this.history = new Map();
    }
    /**
     * @function getLastEntries
     * @param count : number = 1 - The number of entries to return
     * @returns Map<number, ILogEntry> - A map of the last entries
     */
    getLastEntries(count = 1) {
        const lastEntries = new Map();
        const historyArray = Array.from(this.history);
        const lastEntriesArray = historyArray.slice(-count);
        lastEntriesArray.forEach((entry) => {
            lastEntries.set(entry[0], entry[1]);
        });
        return lastEntries;
    }
    /**
     * @function getWorkerHistory
     * @param workerId : string - The worker id to get the history for
     * @returns Map<number, ILogEntry> - A map of the history for the worker
     * @description Returns a map of the history for the worker
     *
     */
    getWorkerHistory(workerId) {
        const workerHistory = new Map();
        this.history.forEach((entry, key) => {
            if (entry.workerId === workerId) {
                workerHistory.set(key, entry);
            }
        });
        return workerHistory;
    }
    /**
     * @function getJobHistory
     * @param processId : string - The job id to get the history for
     * @returns Map<number, ILogEntry> - A map of the history for the job
     * @description Returns a map of the history for the job
     */
    getJobHistory(processId) {
        const jobHistory = new Map();
        this.history.forEach((entry, key) => {
            if (entry.processId === processId) {
                jobHistory.set(key, entry);
            }
        });
        return jobHistory;
    }
}
/**
 * @class LogBooksManager
 * @description A class to manage the system's collection of log books
 */
class LogBooksManager {
    books = new Map();
    constructor() {
        this.create(Component.DB);
        this.create(Component.IPFS);
        this.create(Component.LIBP2P);
        this.create(Component.ORBITDB);
        this.create(Component.SYSTEM);
    }
    /**
     * @function create
     * @param logBookName : LogBookNames - The name of the log book to create
     * @returns void
     * @description Creates a new log book and adds it to the collection
     */
    create(logBookName) {
        const newLogBook = new LogBook(logBookName);
        this.books.set(newLogBook.name, newLogBook);
    }
    /**
     * @function get
     * @param logBookName  : LogBookNames - The name of the log book to get
     * @returns LogBook - The log book
     * @description Gets a log book from the collection
     */
    get(logBookName) {
        const logBook = this.books.get(logBookName);
        if (logBook) {
            return logBook;
        }
        else {
            throw new Error("Log Book not found");
        }
    }
    /**
     * @function delete
     * @param logBookName : LogBookNames - The name of the log book to delete
     * @returns void
     * @description Deletes a log book from the collection
     */
    delete(logBookName) {
        this.books.delete(logBookName);
    }
    /**
     * @function clear
     * @returns void
     * @description Clears all the log books
     */
    clear() {
        for (const logBook of this.books.values()) {
            logBook.clear();
        }
    }
    /**
     * @function getAllEntries
     * @returns Map<number, LogBook> - A map of all the entries
     * @description Returns a map of all the entries
     */
    getAllEntries() {
        const allEntries = new Map();
        for (const logBook of this.books) {
            for (const entry of logBook[1].history) {
                const entryKey = `${logBook[0]}-${entry[0]}`;
                allEntries.set(entryKey, logBook[1]);
            }
        }
        return allEntries;
    }
}
const logBookManager = new LogBooksManager();
const logger = ({ level, code, component, message, processId, workerId }) => {
    const logBook = logBookManager.get(component ? component : Component.SYSTEM);
    const entry = {
        level: level ? level : LogLevel.INFO,
        code: code ? code : ResponseCode.UNKNOWN,
        timestamp: new Date(),
        message: message,
        workerId: workerId,
        processId: processId
    };
    logBook.add(entry);
    switch (level) {
        case LogLevel.ERROR:
            console.error(`[${entry.timestamp.toUTCString()}] [${component ? component : 'SYSTEM'}] ${message}`);
            break;
        case LogLevel.WARN:
            console.warn(`[${entry.timestamp.toUTCString()}] [${component ? component : 'SYSTEM'}] ${message}`);
            break;
        case LogLevel.INFO:
            console.info(`[${entry.timestamp.toUTCString()}] [${component ? component : 'SYSTEM'}] ${message}`);
            break;
        case LogLevel.DEBUG:
            console.debug(`[${entry.timestamp.toUTCString()}] [${component ? component : 'SYSTEM'}] ${message}`);
            break;
        default:
            console.log(`[${entry.timestamp.toUTCString()}] [${component ? component : 'SYSTEM'}] ${message}`);
            break;
    }
};
const getLogBook = (logBookName) => {
    return logBookManager.get(logBookName);
};
export { logBookManager, logger, getLogBook, LogEntry, LogBook, LogBooksManager };
