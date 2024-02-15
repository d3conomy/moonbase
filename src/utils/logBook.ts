import {
    Component,
    ResponseCode,
    LogLevel
} from './constants.js';

interface ILogEntry {
    level?: LogLevel;
    code?: ResponseCode;
    timestamp: Date;
    message: string;
    workerId?: string;
    processId?: string;

    print: () => void;
}

class LogEntry
    implements ILogEntry
{
    public level?: LogLevel;
    public code?: ResponseCode;
    public timestamp: Date;
    public message: string;
    public workerId?: string;
    public processId?: string;

    public constructor({
        message,
        level,
        code,
        workerId,
        processId,
    }: {
        message: string,
        level?: LogLevel,
        code?: ResponseCode,
        workerId?: string,
        processId?: string,
    }) {
        this.level = level ? level : LogLevel.INFO;
        this.code = code ? code : ResponseCode.UNKNOWN;
        this.timestamp = new Date();
        this.message = message;
        this.workerId = workerId;
        this.processId = processId;

        this.print();
    }

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

interface ILogBook {
    name: string;
    entries: Map<number, ILogEntry>;

    add: (entry: ILogEntry) => void;
    get: (id: number) => ILogEntry;
    delete: (id: number) => void;
    clear: () => void;
    getAll: () => Map<number, ILogEntry>;
    getWorkerHistory: (workerId: string) => Map<number, ILogEntry>;
    getProcessHistory: (processId: string) => Map<number, ILogEntry>;
    getLastEntries: (count: number) => Map<number, ILogEntry>;
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
    public getLastEntries(count: number = 1): Map<number, LogEntry> {
        const lastEntries: Map<number, LogEntry> = new Map<number, LogEntry>();
        const historyArray = Array.from(this.entries);
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
    public getWorkerHistory(workerId: string): Map<number, LogEntry> {
        const workerHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
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
    public getProcessHistory(processId: string): Map<number, LogEntry> {
        const jobHistory: Map<number, LogEntry> = new Map<number, LogEntry>();
        this.entries.forEach((entry, key) => {
            if (entry.processId === processId) {
                jobHistory.set(key, entry);
            }
        });
        return jobHistory;
    }
}


interface ILogBooksManager {
    books: Map<string, ILogBook>;

    create: (name: Component) => void;
    get: (name: Component) => ILogBook;
    delete: (name: Component) => void;
    clear: () => void;
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
    public create(
        logBookName: Component
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
        name: Component
    ): LogBook {
        const logBook: LogBook | undefined = this.books.get(name);
        if (logBook) {
            return logBook;
        }
        else {
            throw new Error("Log Book not found");
        }
    }

    /**
     * @function delete
     * @param name : LogBookNames - The name of the log book to delete
     * @returns void
     * @description Deletes a log book from the collection
     */
    public delete(
        name: Component
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
     * @returns Map<number, LogBook> - A map of all the entries
     * @description Returns a map of all the entries
     */
    public getAllEntries() {
        const allEntries: Map<string, LogBook> = new Map<string, LogBook>();
        for (const logBook of this.books) {
            for (const entry of logBook[1].entries) {
                const entryKey = `${logBook[0]}-${entry[0]}`;
                allEntries.set(entryKey, logBook[1]);
            }
        }
        return allEntries;
    }
}


const logBookManager = new LogBooksManager();

const logger = ({
    level,
    code,
    component,
    message,
    processId,
    workerId
}: {
    level?: LogLevel,
    message: string,
    code?: ResponseCode,
    component?: Component,
    processId?: string,
    workerId?: string
}) => { 
    const logBook = logBookManager.get(component ? component : Component.SYSTEM);
    const entry: LogEntry = new LogEntry({
        level: level ? level : LogLevel.INFO,
        code: code ? code : ResponseCode.UNKNOWN,
        message: message,
        workerId: workerId,
        processId: processId
    })
    logBook.add(entry);
    

}

    
const getLogBook = (logBookName: Component): LogBook => {
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