import express from 'express';
import { logBooksManager, logger } from '../../utils/logBook.js';
import { LogLevel, ResponseCode } from 'd3-artifacts';
/**
 * The metrics router
 * @category API
 */
const router = express.Router();
/**
 * @openapi
 * /api/v0/ping:
 *  get:
 *   summary: Returns a Hello World message
 *   tags:
 *    - metrics
 *   responses:
 *    200:
 *     description: Returtns the serers ping
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 *
 */
router.get('/ping', function (req, res) {
    const start = process.hrtime();
    res.send('pong');
    const end = process.hrtime(start);
    logger({
        name: 'api-server',
        message: `Ping execution time: ${end[0]}s ${end[1] / 1000000}ms`,
        level: LogLevel.INFO,
        code: ResponseCode.SUCCESS
    });
});
/**
 * @openapi
 * /api/v0/logbooks:
 *  get:
 *   summary: Returns the logbooks
 *   tags:
 *    - logs
 *   responses:
 *    200:
 *     description: Returns the logbooks
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: string
 *        example: [ "logbook1", "logbook2" ]
 */
router.get('/logbooks', function (req, res) {
    res.send(Array.from(logBooksManager.books.keys()));
});
/**
 * @openapi
 * /api/v0/logbooks/{logbook}:
 *  get:
 *   summary: Returns the logbook
 *   tags:
 *    - logs
 *   parameters:
 *    - in: path
 *      name: logbook
 *      required: true
 *      description: The logbook name
 *      schema:
 *       type: string
 *       example: system
 *    - in: query
 *      name: items
 *      required: false
 *      description: The number of items to return
 *      schema:
 *       type: integer
 *       default: 10
 *   responses:
 *    200:
 *     description: Returns the logbook
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          timestamp:
 *           type: string
 *          message:
 *           type: string
 *        example: [ { "timestamp": "2021-08-16T19:15:00.000Z", "message": "Hello World" } ]
 *    404:
 *     description: Logbook not found
 */
router.get('/logbooks/:logbook', function (req, res) {
    const logbook = req.params.logbook;
    const items = req.query.items ? parseInt(req.query.items) : 10;
    const book = logBooksManager.books.get(logbook);
    if (book) {
        // return the last items as a JSON Map
        const response = Array.from(book.getLast(items)).slice(-items);
        res.send(response);
    }
    else {
        res.status(404).send('Logbook not found');
    }
});
/**
 * @openapi
 * /api/v0/logs:
 *  get:
 *   summary: Returns the logs
 *   tags:
 *    - logs
 *   parameters:
 *    - in: query
 *      name: items
 *      required: false
 *      description: The number of items to return
 *      schema:
 *       type: integer
 *       default: 10
 *   responses:
 *    200:
 *     description: Returns the logs
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          timestamp:
 *           type: string
 *          message:
 *           type: string
 *        example: [ { "timestamp": "2021-08-16T19:15:00.000Z", "message": "Hello World" } ]
 */
router.get('/logs', function (req, res) {
    const items = req.query.items ? parseInt(req.query.items) : 10;
    const response = Array.from(logBooksManager.getAllEntries(items)).slice(-items);
    res.send(response);
});
export { router as metricsRouter };
