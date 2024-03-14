
import {
    Component,
    ResponseCode,
    LogLevel,
    ProcessStage
} from './constants.js';

import {
    IdReference
} from './id.js';


/**
 * @interface ILogEntry
 * @description Interface for a log entry
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

    print: () => void;
}

/**
 * @class LogEntry
 * @implements ILogEntry
 * @description A class to represent a log entry
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

    public constructor({
        podId,
        processId,
        message,
        level,
        code,
        stage,
        error
    }: {
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

        this.print();
    }

    /**
     * @function print
     * @returns void
     * @description Prints the log entry to the console
     */
    public print = (): void => {
        const timestamp = this.timestamp.toUTCString();
        const output = `[${timestamp}] ${this.message}`;
        
        switch (this.level) {
            case LogLevel.ERROR:
                console.error(output);
                break;
            case LogLevel.WARN:
                console.warn(output);
                break;
            case LogLevel.INFO:
                console.info(output);
                break;
            case LogLevel.DEBUG:
                console.debug(output);
                break;
            default:
                console.log(output);
                break;
        }
    }
}


/**
 * @interface ILogBook
 * @description Interface for a log book
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
 * @class LogBook
 * @implements ILogBook
 * @description A class to manage an individual log book
 */
class LogBook
    implements ILogBook
{
    public name: string;
    public entries: Map<number, LogEntry>;

    public constructor(name: string) {
        this.name = name
        this.entries = new Map<number, LogEntry>();
    }

    /**
     * @function add
     * @param entry : ILogEntry - The entry to add to the log book
     * @returns void
     * @description Adds an entry to the log book
     */
    public add(entry: LogEntry):  void {
        const counter = this.entries.size + 1;
        this.entries.set(counter, entry);
    }

    /**
     * @function get
     * @param entryId : number - The id of the entry to get
     * @returns ILogEntry - The entry
     * @description Gets an entry from the log book
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
     * @function delete
     * @param entryId : number - The id of the entry to delete
     * @returns void
     * @description Deletes an entry from the log book
     */
    public delete(entryId: number): void {
        this.entries.delete(entryId);
    }

    /**
     * @function getAll
     * @returns Map<number, ILogEntry> - A map of all the entries
     * @description Returns a map of all the entries
     */
    public getAll(): Map<number, ILogEntry> {
        return this.entries;
    }

    /**
     * @function clear
     * @returns void
     * @description Clears the entire log book
     */
    public clear(): void {
        this.entries = new Map<number, LogEntry>();
    }

    /**
     * @function getLastEntries
     * @param count : number = 1 - The number of entries to return
     * @returns Map<number, ILogEntry> - A map of the last entries
     */
    public getLast(count: number = 1): Map<number, LogEntry> {
        let lastEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
        let historyArray = Array.from(this.entries);
        let lastEntriesArray = historyArray.slice(-count);
        lastEntriesArray.forEach((entry, index) => {
            lastEntries.set(index, entry[1]);
        });
        return lastEntries;
    }

    /**
     * @function getPodHistory
     * @param podId : string - The pod id to get the history for
     * @returns Map<number, ILogEntry> - A map of the history for the pod
     * @description Returns a map of the history for the pod
     * 
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
     * @function getProcessHistory
     * @param processId : string - The job id to get the history for
     * @returns Map<number, LogEntry> - A map of the history for the job
     * @description Returns a map of the history for the job
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
     * @function getLevelHistory
     * @param level : LogLevel - The log level to get the history for
     * @returns Map<number, LogEntry> - A map of the history for the log level
     * @description Returns a map of the history for the log level
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
 * @interface ILogBooksManager
 * @description Interface for a log books manager
 */
interface ILogBooksManager {
    books: Map<string, ILogBook>;

    create: (name: string) => void;
    get: (name: string) => ILogBook;
    delete: (name: string) => void;
    clear: () => void;
    getAllEntries: () => Map<number, ILogEntry>;
}

/**
 * @class LogBooksManager
 * @description A class to manage the system's collection of log books
 */
class LogBooksManager 
    implements ILogBooksManager
{
    public books: Map<string, LogBook> = new Map<string, LogBook>();

    public constructor() {
        this.create(Component.SYSTEM);
    }

    /**
     * @function create
     * @param logBookName : LogBookNames - The name of the log book to create
     * @returns void
     * @description Creates a new log book and adds it to the collection
     */
    public create(
        logBookName: string
    ) {
        const newLogBook = new LogBook(logBookName);
        this.books.set(newLogBook.name, newLogBook);
    }

    /**
     * @function get
     * @param name  : LogBookNames - The name of the log book to get
     * @returns LogBook - The log book
     * @description Gets a log book from the collection
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
     * @function delete
     * @param name : LogBookNames - The name of the log book to delete
     * @returns void
     * @description Deletes a log book from the collection
     */
    public delete(
        name: string
    ) {
        this.books.delete(name);
    }

    /**
     * @function clear
     * @returns void
     * @description Clears all the log books
     */
    public clear() {
        for (const logBook of this.books.values()) {
            logBook.clear();
        }
    }

    /**
     * @function getAllEntries
     * @returns Map<number, LogEntry> - A map of all the entries
     * @description Returns a map of all the entries
     */
    public getAllEntries() {
        let allEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
        for (const logBook of this.books) {
            const entries = logBook[1].getAll();
            entries.forEach((entry, key) => {
                allEntries.set(key, entry);
            });
        }
        return allEntries;
    }
}


const logBookManager = new LogBooksManager();

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
        logBook = logBookManager.get(name);
    }
    catch (error) {
        logBookManager.create(name);
    }

    logBook = logBookManager.get(name);

    const entry: LogEntry = new LogEntry({
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

const getLogBook = (logBookName: string): LogBook => {
    return logBookManager.get(logBookName);
}

export {
    logBookManager,
    logger,
    getLogBook,
    LogEntry,
    LogBook,
    LogBooksManager
}