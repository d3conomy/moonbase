import { Component, LogLevel, isLogLevel } from './constants.js';
/**
 * A class to represent a log entry
 * @category Logging
 */
class LogEntry {
    podId;
    processId;
    level;
    code;
    stage;
    timestamp;
    message;
    error;
    printLevel;
    constructor({ printLevel, podId, processId, message, level, code, stage, error }) {
        this.podId = podId;
        this.processId = processId;
        this.message = message;
        this.level = level ? isLogLevel(level) : LogLevel.INFO;
        this.code = code;
        this.stage = stage;
        this.timestamp = new Date();
        this.error = error;
        this.printLevel = printLevel ? isLogLevel(printLevel) : LogLevel.INFO;
        this.print(this.printLevel);
    }
    /**
     * Prints the log entry to the console
     */
    print = (printLevel) => {
        const timestamp = this.timestamp.toUTCString();
        const output = `[${timestamp}] ${this.message}`;
        switch (this.level) {
            case LogLevel.ERROR:
                if (printLevel === LogLevel.ERROR ||
                    printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG) {
                    console.error(output);
                }
                break;
            case LogLevel.WARN:
                if (printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG) {
                    console.warn(output);
                }
                break;
            case LogLevel.INFO:
                if (printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG) {
                    console.info(output);
                }
                break;
            case LogLevel.DEBUG:
                if (printLevel === LogLevel.DEBUG)
                    console.debug(output);
                break;
            default:
                console.log(output);
                break;
        }
    };
}
/**
 * A class to manage an individual log book
 * @category Logging
 */
class LogBook {
    name;
    entries;
    printLevel;
    constructor(name, printLevel = "info") {
        this.name = name;
        this.printLevel = isLogLevel(printLevel);
        this.entries = new Map();
    }
    /**
     * Adds an entry to the log book
     */
    add(entry) {
        if (!entry.printLevel ||
            entry.printLevel !== this.printLevel) {
            entry.printLevel = this.printLevel;
        }
        const counter = this.entries.size + 1;
        this.entries.set(counter, entry);
    }
    /**
     * Gets an entry from the log book
     */
    get(entryId) {
        const entry = this.entries.get(entryId);
        if (entry) {
            return entry;
        }
        else {
            throw new Error("Entry not found");
        }
    }
    /**
     * Deletes an entry from the log book
     */
    delete(entryId) {
        this.entries.delete(entryId);
    }
    /**
     * Returns a map of all the entries
     */
    getAll() {
        return this.entries;
    }
    /**
     * Clears the entire log book
     */
    clear() {
        this.entries = new Map();
    }
    /**
     * Retrieve the last n entries from the log book
     */
    getLast(count = 1) {
        let lastEntries = new Map();
        let historyArray = Array.from(this.entries);
        let lastEntriesArray = historyArray.slice(-count);
        lastEntriesArray.forEach((entry) => {
            lastEntries.set(entry[0], entry[1]);
        });
        return lastEntries;
    }
    /**
     * Returns a map of the history for the pod
     */
    getPodHistory(podId) {
        let podHistory = new Map();
        this.entries.forEach((entry, key) => {
            if (entry.podId?.name === podId &&
                entry.podId?.component === `${Component.POD}`) {
                podHistory.set(key, entry);
            }
        });
        return podHistory;
    }
    /**
     * Returns a map of the history for the job
     */
    getProcessHistory(processId) {
        let jobHistory = new Map();
        this.entries.forEach((entry, key) => {
            if (entry.processId?.name === processId) {
                jobHistory.set(key, entry);
            }
        });
        return jobHistory;
    }
    /**
     * Returns a map of the history for the log level
     */
    getLevelHistory(level) {
        let levelHistory = new Map();
        this.entries.forEach((entry, key) => {
            if (entry.level === level) {
                levelHistory.set(key, entry);
            }
        });
        return levelHistory;
    }
}
/**
 * A class to manage the system's collection of log books
 * @category Logging
 */
class LogBooksManager {
    /* The collection of log books */
    books = new Map();
    /* The log level to print */
    printLevel = 'info';
    /* The directory to store the log files
    * TODO: Implement file storage
    */
    dir = "";
    constructor() {
        this.books = new Map();
        this.printLevel = 'info';
    }
    /**
     * Initializes the log books manager
     */
    init({ dir, level } = {}) {
        this.printLevel = isLogLevel(level);
        this.dir = dir ? dir : "";
        this.create(Component.SYSTEM);
    }
    /**
     * Creates a new log book and adds it to the collection
     */
    create(logBookName) {
        // if (this.books.has(logBookName)) {
        //     throw new Error("Log book already exists");
        // }
        const newLogBook = new LogBook(logBookName, this.printLevel);
        this.books.set(newLogBook.name, newLogBook);
    }
    /**
     * Gets a log book from the collection
     */
    get(name) {
        const logBook = this.books.get(name);
        if (logBook) {
            return logBook;
        }
        else {
            throw new Error("Log book not found");
        }
    }
    /**
     * Deletes a log book from the collection
     */
    delete(name) {
        this.books.delete(name);
    }
    /**
     * Clears all the log books
     */
    clear() {
        for (const logBook of this.books.values()) {
            logBook.clear();
        }
    }
    /**
     * Returns a map of all the entries
     */
    getAllEntries(item = 10) {
        let allEntries = new Map();
        for (const logBook of this.books.values()) {
            const entries = logBook.getLast(item);
            entries.forEach((entry, key) => {
                allEntries.set(key, entry);
            });
            // sort the entries by timestamp
            allEntries = new Map([...allEntries.entries()].sort((a, b) => {
                return a[1].timestamp.getTime() - b[1].timestamp.getTime();
            }));
        }
        return allEntries;
    }
}
/**
 * The log books manager
 * @category Logging
 * @example
 * const logBooksManager = new LogBooksManager();
 * logBooksManager.create("system");
 * logBooksManager.get("system");
 */
const logBooksManager = new LogBooksManager();
/**
 * Log a message to the console
 * @category Logging
 * @example
 * logger({
 *     name: "system",
 *     level: LogLevel.INFO,
 *     code: ResponseCode.OK,
 *     stage: ProcessStage.START,
 *     message: "System started",
 *     error: undefined,
 *     processId: undefined,
 *     podId: undefined
 * });
 */
const logger = ({ name, level, code, stage, message, error, processId, podId }) => {
    let logBook;
    if (!name) {
        name = Component.SYSTEM;
    }
    try {
        logBook = logBooksManager.get(name);
    }
    catch (error) {
        logBooksManager.create(name);
    }
    logBook = logBooksManager.get(name);
    const entry = new LogEntry({
        printLevel: logBooksManager.printLevel,
        level: level ? level : LogLevel.INFO,
        code: code,
        stage: stage,
        message: message,
        error: error,
        podId: podId,
        processId: processId
    });
    logBook.add(entry);
};
/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
const getLogBook = (logBookName) => {
    return logBooksManager.get(logBookName);
};
export { logBooksManager, logger, getLogBook, LogEntry, LogBook, LogBooksManager };
