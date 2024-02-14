import { expect } from 'chai';

import {
    LogLevel,
    Component
} from '../utils/constants.js';

import {
    logger,
    LogBooksManager,
    LogBook,
    LogEntry
} from '../utils/logBook.js';
import { createRandomId } from '../utils/id.js';


describe('LogBook:logBookskManager', () => {
        let testMessage: string = 'This is a test message: ' + createRandomId();
    
        beforeEach(() => {
            testMessage = 'This is a test message: ' + createRandomId();
        });
    
        it('should create a new log book', () => {
            const logBookManager = new LogBooksManager();
            const logBook = logBookManager.get(Component.SYSTEM);
            expect(logBook).instanceOf(LogBook);
        });
    
        it('should add an entry to the log book', () => {
            const logBookManager = new LogBooksManager();
            const logBook = logBookManager.get(Component.SYSTEM);
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage
            });
            logBook.add(entry);
            expect(logBook.entries.size).equal(1);
        });
    
        it('should get a log book', () => {
            const logBookManager = new LogBooksManager();
            const logBook = logBookManager.get(Component.SYSTEM);
            expect(logBook).instanceOf(LogBook);
        });
    
        it('should get a log book by name', () => {
            const logBookManager = new LogBooksManager();
            const logBook = logBookManager.get(Component.SYSTEM);
            expect(logBook).instanceOf(LogBook);
        });
    
        it('should get all log books', () => {
            const logBookManager = new LogBooksManager();
            const logBooks = logBookManager.getAllEntries();
            expect(logBooks.size).equals(0);
        });
        
});


describe('LogBook:logBook', () => {

    let testMessage: string = 'This is a test message: ' + createRandomId();
    
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
    });

    it('should create a new log entry', () => {
        const entry: LogEntry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage
        });
        expect(entry).instanceOf(LogEntry);
    });

    it('should add an entry to the log book', () => {
        const logBook = new LogBook(Component.DB);
        const entry: LogEntry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage
        });
        logBook.add(entry);
        expect(logBook.entries.size).equal(1);
    });

    it('should clear the log book', () => {
        const logBook = new LogBook(Component.DB);
        const entry: LogEntry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage
        });
        logBook.add(entry);
        logBook.clear();
        expect(logBook.entries.size).equal(0);
    });

    it('should delete the log book', () => {
        const logBook = new LogBook(Component.DB);
        const entry: LogEntry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage
        });
        logBook.add(entry);
        logBook.delete(1);
        expect(logBook.entries.size).equal(0);
    });

    it('should get all entries', () => {
        const logBook = new LogBook(Component.DB);
        const entry: LogEntry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage
        });
        logBook.add(entry);
        const allEntries = logBook.getAll();
        expect(allEntries.size).equal(1);
    });
    
});


describe("LogBook:logEntry", () => {
    
    let testMessage: string = 'This is a test message: ' + createRandomId();
    
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
    });
    
        it('should create a new log entry', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage
            });
            expect(entry).instanceOf(LogEntry);
        });
    
        it('should get the log entry level', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage
            });
            expect(entry.level).equal(LogLevel.INFO);
        });
    
        it('should get the log entry code', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage
            });
            expect(entry.code).equal(200);
        });
    
        it('should get the log entry message', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage
            });
            expect(entry.message).equal(testMessage);
        });
    
        it('should get the log entry timestamp', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage
            });
            expect(entry.timestamp).instanceOf(Date);
        });
    
        it('should get the log entry processId', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage,
                processId: '1234'
            });
            expect(entry.processId).equal('1234');
        });
    
        it('should get the log entry workerId', () => {
            const entry: LogEntry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessage,
                workerId: '1234'
            });
            expect(entry.workerId).equal('1234');
        });
        
});


describe('LogBook:logger', () => {

    let testMessage: string = 'This is a test message: ' + createRandomId();
    
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
    });

    it('should log an error', () => {
        logger({
            level: LogLevel.ERROR,
            message: 'This is an error message',
            component: Component.SYSTEM
        });
    });

    it('should log a warning', () => {
        logger({
            level: LogLevel.WARN,
            message: 'This is a warning message',
            component: Component.SYSTEM
        });
    });

    it('should log an info', () => {
        logger({
            level: LogLevel.INFO,
            message: 'This is an info message',
            component: Component.SYSTEM
        });
    });

    it('should log a debug', () => {
        logger({
            level: LogLevel.DEBUG,
            message: 'This is a debug message',
            component: Component.SYSTEM
        });
    });
    
});
