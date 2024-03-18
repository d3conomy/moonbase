import { ResponseCode, LogLevel, ProcessStage } from './constants.js';
import { IdReference } from './id.js';
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
declare class LogEntry implements ILogEntry {
    podId?: IdReference;
    processId?: IdReference;
    level?: LogLevel;
    code?: ResponseCode;
    stage?: ProcessStage | string;
    timestamp: Date;
    message: string;
    error?: Error;
    printLevel: LogLevel;
    constructor({ printLevel, podId, processId, message, level, code, stage, error }: {
        printLevel?: LogLevel | string;
        podId?: IdReference;
        processId?: IdReference;
        message: string;
        level?: LogLevel | string;
        code?: ResponseCode;
        stage?: ProcessStage | string;
        error?: Error;
    });
    /**
     * Prints the log entry to the console
     */
    print: (printLevel: LogLevel) => void;
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
declare class LogBook implements ILogBook {
    name: string;
    entries: Map<number, LogEntry>;
    printLevel: LogLevel;
    constructor(name: string, printLevel?: LogLevel | string);
    /**
     * Adds an entry to the log book
     */
    add(entry: LogEntry): void;
    /**
     * Gets an entry from the log book
     */
    get(entryId: number): LogEntry;
    /**
     * Deletes an entry from the log book
     */
    delete(entryId: number): void;
    /**
     * Returns a map of all the entries
     */
    getAll(): Map<number, ILogEntry>;
    /**
     * Clears the entire log book
     */
    clear(): void;
    /**
     * Retrieve the last n entries from the log book
     */
    getLast(count?: number): Map<number, LogEntry>;
    /**
     * Returns a map of the history for the pod
     */
    getPodHistory(podId: string): Map<number, LogEntry>;
    /**
     * Returns a map of the history for the job
     */
    getProcessHistory(processId: string): Map<number, LogEntry>;
    /**
     * Returns a map of the history for the log level
     */
    getLevelHistory(level: LogLevel): Map<number, LogEntry>;
}
/**
 * Interface for a log books manager
 * @category Logging
 */
interface ILogBooksManager {
    books: Map<string, ILogBook>;
    printLevel: LogLevel | string;
    init: (config: {
        dir: string;
        level: string;
        names: string;
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
declare class LogBooksManager implements ILogBooksManager {
    books: Map<string, LogBook>;
    printLevel: LogLevel | string;
    dir: string;
    constructor();
    /**
     * Initializes the log books manager
     */
    init({ dir, level }?: {
        dir?: string;
        level?: string;
    }): void;
    /**
     * Creates a new log book and adds it to the collection
     */
    create(logBookName: string): void;
    /**
     * Gets a log book from the collection
     */
    get(name: string): LogBook;
    /**
     * Deletes a log book from the collection
     */
    delete(name: string): void;
    /**
     * Clears all the log books
     */
    clear(): void;
    /**
     * Returns a map of all the entries
     */
    getAllEntries(item?: number): Map<number, LogEntry>;
}
/**
 * The log books manager
 * @category Logging
 * @example
 * const logBooksManager = new LogBooksManager();
 * logBooksManager.create("system");
 * logBooksManager.get("system");
 */
declare const logBooksManager: LogBooksManager;
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
declare const logger: ({ name, level, code, stage, message, error, processId, podId }: {
    name?: string | undefined;
    level?: LogLevel | undefined;
    message: string;
    code?: ResponseCode | undefined;
    stage?: string | undefined;
    error?: Error | undefined;
    processId?: IdReference | undefined;
    podId?: IdReference | undefined;
}) => void;
/**
 * Get the log book by name
 * @category Logging
 * @example
 * const logBook = getLogBook("system");
 */
declare const getLogBook: (logBookName: string) => LogBook;
export { logBooksManager, logger, getLogBook, ILogEntry, LogEntry, ILogBook, LogBook, ILogBooksManager, LogBooksManager };
//# sourceMappingURL=logBook.d.ts.map