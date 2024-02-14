import { LogLevel, Component } from '../utils/constants.js';
import { logger } from '../utils/logBook.js';
describe('LogBook', () => {
    beforeEach(() => {
        // runs before each test in this block
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
});
