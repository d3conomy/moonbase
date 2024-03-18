import { expect } from 'chai';
import { LogLevel, Component, ProcessStage } from '../utils/constants.js';
import { logger, logBooksManager as logBookManagerSample, getLogBook, LogBooksManager, LogBook, LogEntry } from '../utils/logBook.js';
import { IdReference, createRandomId } from '../utils/id.js';
describe('Utils::LogBook::LogEntry', () => {
    let testMessageString;
    let testMessageAny;
    let podId;
    let processId;
    let error;
    beforeEach(() => {
        testMessageString = 'This is a test message: ' + createRandomId();
        testMessageAny = { message: 'This is a test message: ' + createRandomId() };
        podId = new IdReference({ component: Component.POD });
        processId = new IdReference({ component: Component.PROCESS });
        error = new Error('This is a test error');
    });
    it('should create a new log entry', () => {
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessageString,
            podId: podId,
            processId: processId,
            error: error
        });
        expect(entry).instanceOf(LogEntry);
    });
    it('should get the log entry level', () => {
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessageString,
            podId: podId,
            processId: processId,
            error: error
        });
        expect(entry.level).equal(LogLevel.INFO);
    });
    it('should print the log entry to be empty', () => {
        try {
            const entry = new LogEntry({
                level: LogLevel.INFO,
                code: 200,
                message: testMessageString,
                podId: podId,
                processId: processId,
                error: error
            });
            expect(entry.error?.message).equal('This is a test error');
        }
        catch (error) {
            expect(error).instanceOf(Error);
        }
    });
    it('should get the log entry code', () => {
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessageString,
            podId: podId,
            processId: processId,
            error: error
        });
        expect(entry.code).equal(200);
    });
    it('should create a correct timestamp', () => {
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessageString,
            podId: podId,
            processId: processId,
            error: error
        });
        expect(entry.timestamp).instanceOf(Date);
    });
});
describe('Utils::LogBook::LogBook', () => {
    let testMessage;
    let podId;
    let processId;
    let error;
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
        podId = new IdReference({ component: Component.POD });
        processId = new IdReference({ component: Component.PROCESS });
        error = new Error('This is a test error');
    });
    it('should create a new log book', () => {
        const logBook = new LogBook(Component.SYSTEM);
        expect(logBook).instanceOf(LogBook);
    });
    it('should add an entry to the log book', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        expect(logBook.entries.size).equal(1);
    });
    it('should clear the log book', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        logBook.clear();
        expect(logBook.entries.size).equal(0);
    });
    it('should delete the log book', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        logBook.delete(1);
        expect(logBook.entries.size).equal(0);
    });
    it('should get all entries', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        const allEntries = logBook.getAll();
        expect(allEntries.size).equal(1);
    });
    it('should get an entry', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        const getEntry = logBook.get(1);
        expect(getEntry).instanceOf(LogEntry);
    });
    it('should get the log book name', () => {
        const logBook = new LogBook(Component.SYSTEM);
        expect(logBook.name).equal(Component.SYSTEM);
    });
    it('should get the entries of a level', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        const entries = logBook.getLevelHistory(LogLevel.INFO);
        expect(entries.size).equal(1);
    });
    it('should get the entries of a process', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        const entries = logBook.getProcessHistory(processId.getId());
        expect(entries.size).equal(1);
    });
    it('should get the history of the pod', () => {
        const logBook = new LogBook(Component.SYSTEM);
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry);
        const entries = logBook.getPodHistory(podId.getId());
        expect(entries.size).equal(1);
    });
    it('should create two entries and get the last one', () => {
        let logBook = new LogBook(Component.SYSTEM);
        const entry1 = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        const entry2 = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            message: testMessage + '-testItem2',
            podId: podId,
            processId: processId,
            error: error
        });
        logBook.add(entry1);
        logBook.add(entry2);
        console.log(JSON.stringify(logBook.entries.get(1)));
        console.log(JSON.stringify(logBook.entries.get(2)));
        const lastEntry = logBook.getLast();
        for (const [key, value] of lastEntry.entries()) {
            expect(value).equal(entry2);
        }
    });
});
describe('Utils::LogBook::LogBooksManager', () => {
    let testMessage;
    let podId;
    let processId;
    let error;
    let stage;
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
        podId = new IdReference({ component: Component.POD });
        processId = new IdReference({ component: Component.PROCESS });
        error = new Error('This is a test error');
        stage = ProcessStage.NEW;
    });
    it('should create a new log book manager', () => {
        const logBookManager = new LogBooksManager();
        expect(logBookManager).instanceOf(LogBooksManager);
    });
    it('should get a log book', () => {
        const logBookManager = new LogBooksManager();
        const logBook = logBookManager.get(Component.SYSTEM);
        expect(logBook).instanceOf(LogBook);
    });
    it('should get all log books', () => {
        const logBookManager = new LogBooksManager();
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            stage: stage,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBookManager.get(Component.SYSTEM).add(entry);
        const logBooks = logBookManager.getAllEntries();
        expect(logBooks.size).equal(1);
    });
    it('should create a new log entry', () => {
        const logBookManager = new LogBooksManager();
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            stage: stage,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBookManager.get(Component.SYSTEM).add(entry);
        const logBook = logBookManager.get(Component.SYSTEM);
        console.log(JSON.stringify(logBook.entries.get(1)));
        expect(logBook.entries.size).equal(1);
    });
});
describe('Utils::LogBook::logBookManagerSample', () => {
    let testMessage;
    let podId;
    let processId;
    let error;
    let stage;
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
        podId = new IdReference({ component: Component.POD });
        processId = new IdReference({ component: Component.PROCESS });
        error = new Error('This is a test error');
        stage = ProcessStage.NEW;
        logBookManagerSample.clear();
    });
    it('should create a new log entry', () => {
        const entry = new LogEntry({
            level: LogLevel.INFO,
            code: 200,
            stage: stage,
            message: testMessage,
            podId: podId,
            processId: processId,
            error: error
        });
        logBookManagerSample.get(Component.SYSTEM).add(entry);
        const logBook = logBookManagerSample.get(Component.SYSTEM);
        console.log(JSON.stringify(logBook.entries.get(1)));
        expect(logBook.entries.size).equal(1);
    });
    it('should get a log book', () => {
        const logBook = getLogBook(Component.SYSTEM);
        expect(logBook).instanceOf(LogBook);
    });
});
describe('Utils::LogBook::logger', () => {
    let testMessage;
    let podId;
    let processId;
    let error;
    let stage;
    let logBook;
    beforeEach(() => {
        testMessage = 'This is a test message: ' + createRandomId();
        podId = new IdReference({ component: Component.POD });
        processId = new IdReference({ component: Component.PROCESS });
        error = new Error('This is a test error');
        stage = ProcessStage.NEW;
        logBookManagerSample.clear();
    });
    it('should create a new log entry', () => {
        logBook = getLogBook(Component.SYSTEM);
        // console.log(logBook);
        logger({
            name: Component.SYSTEM,
            level: LogLevel.INFO,
            message: testMessage,
            code: 200,
            stage: stage,
            processId: processId,
            podId: podId,
            error: error
        });
        logBook = getLogBook(Component.SYSTEM);
        expect(logBook.entries.size).equal(1);
    });
    it('should create a new log entry with a different component', () => {
        logger({
            name: Component.ORBITDB,
            level: LogLevel.INFO,
            message: testMessage,
            code: 200,
            stage: stage,
            processId: processId,
            podId: podId,
            error: error
        });
        logBook = getLogBook(Component.ORBITDB);
        expect(logBook.entries.size).equal(1);
    });
    it('should create a new log entry with a different level', () => {
        logger({
            name: Component.SYSTEM,
            level: LogLevel.ERROR,
            message: testMessage,
            code: 200,
            stage: stage,
            processId: processId,
            podId: podId,
            error: error
        });
        logBook = getLogBook(Component.SYSTEM);
        expect(logBook.entries.size).equal(1);
    });
    it('should create n number of log entries', () => {
        for (let i = 0; i < 10; i++) {
            logger({
                name: Component.SYSTEM,
                level: LogLevel.INFO,
                message: testMessage + '-' + i,
                code: 200,
                stage: stage,
                processId: processId,
                podId: podId,
                error: error
            });
        }
        logBook = getLogBook(Component.SYSTEM);
        expect(logBook.entries.size).equal(10);
    });
});