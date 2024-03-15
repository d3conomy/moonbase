
import {
    Component,
    ResponseCode,
    LogLevel,
    ProcessStage,
    isLogLevel,
    isIdReferenceType
} from './constants.js';

import {
    IdReference
} from './id.js';


/**
 * Interface for a log entry
 * @category Logging
 */
interface ILogEntry {
    podId?: IdReference;
    processId?: IdReference;
    level?: LogLevel;
    code?: ResponseCode;
    stage?: ProcessStage | string;
    timestamp: Date;
    message: string;
    error?: Error;
    printLevel: LogLevel;

    print: (logLevel: LogLevel) => void;
}

/**
 * A class to represent a log entry
 * @category Logging
 */
class LogEntry
    implements ILogEntry
{
    public podId?: IdReference;
    public processId?: IdReference;
    public level?: LogLevel;
    public code?: ResponseCode;
    public stage?: ProcessStage | string;
    public timestamp: Date;
    public message: string;
    public error?: Error;
    public printLevel: LogLevel;

    public constructor({
        printLevel,
        podId,
        processId,
        message,
        level,
        code,
        stage,
        error
    }: {
        printLevel?: LogLevel,
        podId?: IdReference,
        processId?: IdReference
        message: string,
        level?: LogLevel,
        code?: ResponseCode,
        stage?: ProcessStage | string,
        error?: Error
    }) {
        this.podId = podId;
        this.processId = processId;
        this.message = message;
        this.level = level ? level : LogLevel.INFO;
        this.code = code;
        this.stage = stage;
        this.timestamp = new Date();
        this.error = error;
        this.printLevel = printLevel ? printLevel : LogLevel.INFO;

        this.print(this.printLevel);
    }

    /**
     * Prints the log entry to the console
     */
    public print = (printLevel: LogLevel): void => {
        const timestamp = this.timestamp.toUTCString();
        const output = `[${timestamp}] ${this.message}`;
        
        switch (this.level) {
            case LogLevel.ERROR:
                if (printLevel === LogLevel.ERROR ||
                    printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG
                ) {
                    console.error(output);
                }
                break;
            case LogLevel.WARN:
                if (printLevel === LogLevel.WARN ||
                    printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG
                ) {
                    console.warn(output);
                }
                break;
            case LogLevel.INFO:
                if (printLevel === LogLevel.INFO ||
                    printLevel === LogLevel.DEBUG
                ) {
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
    }
}


/**
 * Interface for a log book
 * @category Logging
 */
interface ILogBook {
    name: string;
    entries: Map<number, ILogEntry>;

    add: (entry: ILogEntry) => void;
    get: (id: number) => ILogEntry;
    delete: (id: number) => void;
    clear: () => void;
    getAll: () => Map<number, ILogEntry>;
    getPodHistory: (podId: string) => Map<number, ILogEntry>;
    getProcessHistory: (processId: string) => Map<number, ILogEntry>;
    getLast: (count: number) => Map<number, ILogEntry>;
}


/**
 * A class to manage an individual log book
 * @category Logging
 */
class LogBook
    implements ILogBook
{
    public name: string;
    public entries: Map<number, LogEntry>;
    public printLevel: LogLevel = LogLevel.INFO;

    public constructor(name: string, printLevel: LogLevel = LogLevel.INFO) {
        this.name = name
        this.printLevel = printLevel;
        this.entries = new Map<number, LogEntry>();
    }

    /**
     * Adds an entry to the log book
     */
    public add(entry: LogEntry):  void {
        if (!entry.printLevel ||
            entry.printLevel !== this.printLevel
        ) {
            entry.printLevel = this.printLevel;
        }
        const counter = this.entries.size + 1;
        this.entries.set(counter, entry);
    }

    /**
     * Gets an entry from the log book
     */
    public get(entryId: number): LogEntry {
        const entry: LogEntry | undefined = this.entries.get(entryId);
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
    public delete(entryId: number): void {
        this.entries.delete(entryId);
    }

    /**
     * Returns a map of all the entries
     */
    public getAll(): Map<number, ILogEntry> {
        return this.entries;
    }

    /**
     * Clears the entire log book
     */
    public clear(): void {
        this.entries = new Map<number, LogEntry>();
    }

    /**
     * Retrieve the last n entries from the log book
     */
    public getLast(count: number = 1): Map<number, LogEntry> {
        let lastEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
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
    public getPodHistory(podId: string): Map<number, LogEntry> {
        let podHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
            if (
                entry.podId?.name === podId &&
                entry.podId?.component === `${Component.POD}`
            ) {
                podHistory.set(key, entry);
            }
        });
        return podHistory;
    }

    /**
     * Returns a map of the history for the job
     */
    public getProcessHistory(processId: string): Map<number, LogEntry> {
        let jobHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
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
    public getLevelHistory(level: LogLevel): Map<number, LogEntry> {
        let levelHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
            if (entry.level === level) {
                levelHistory.set(key, entry);
            }
        });
        return levelHistory;
    }
}

/**
 * Interface for a log books manager
 * @category Logging
 */
interface ILogBooksManager {
    books: Map<string, ILogBook>;
    printLevel: LogLevel;

    init: (config: {
        dir: string,
        level: string,
        names: string
    }) => void;
    create: (name: string, printLevel: LogLevel) => void;
    get: (name: string) => ILogBook;
    delete: (name: string) => void;
    clear: () => void;
    getAllEntries: () => Map<number, ILogEntry>;
}

/**
 * A class to manage the system's collection of log books
 * @category Logging
 */
class LogBooksManager 
    implements ILogBooksManager
{
    /* The collection of log books */
    public books: Map<string, LogBook> = new Map<string, LogBook>();

    /* The log level to print */
    public printLevel: LogLevel = LogLevel.INFO;

    /* The directory to store the log files 
    * TODO: Implement file storage
    */
    public dir: string = "";

    public constructor() {
        this.books = new Map<string, LogBook>();
    }

    /**
     * Initializes the log books manager
     */
    public init({
        dir,
        level,
    }: {
        dir?: string,
        level?: string,
    }) {
        this.printLevel = isLogLevel(level ? level : LogLevel.INFO);
        this.dir = dir ? dir : "";
        this.create(Component.SYSTEM);
    }

    /**
     * Creates a new log book and adds it to the collection
     */
    public create(
        logBookName: string,
    ) {
        const newLogBook = new LogBook(logBookName, this.printLevel);
        this.books.set(newLogBook.name, newLogBook);
    }

    /**
     * Gets a log book from the collection
     */
    public get(
        name: string
    ): LogBook {
        const logBook: LogBook | undefined = this.books.get(name);
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
    public delete(
        name: string
    ) {
        this.books.delete(name);
    }

    /**
     * Clears all the log books
     */
    public clear() {
        for (const logBook of this.books.values()) {
            logBook.clear();
        }
    }

    /**
     * Returns a map of all the entries
     */
    public getAllEntries(item: number = 10): Map<number, LogEntry> {
        let allEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
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
const logger = ({
    name,
    level,
    code,
    stage,
    message,
    error,
    processId,
    podId
}: {
    name?: string,
    level?: LogLevel,
    message: string,
    code?: ResponseCode,
    stage?: ProcessStage | string,
    error?: Error,
    processId?: IdReference,
    podId?: IdReference
}) => {
    let logBook: LogBook;

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

    const entry: LogEntry = new LogEntry({
        printLevel: logBooksManager.printLevel,
        level: level ? level : LogLevel.INFO,
        code: code,
        stage: stage,
        message: message,
        error: error,
        podId: podId,
        processId: processId
    })
    logBook.add(entry);
}

/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
const getLogBook = (logBookName: string): LogBook => {
    return logBooksManager.get(logBookName);
}

export {
    logBooksManager,
    logger,
    getLogBook,
    ILogEntry,
    LogEntry,
    ILogBook,
    LogBook,
    ILogBooksManager,
    LogBooksManager
}