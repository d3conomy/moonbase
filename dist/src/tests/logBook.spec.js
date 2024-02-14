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
});
