import express from 'express';
const router = express.Router();
/**
 * @openapi
 * /api/v0/metrics/ping:
 *  get:
 *   summary: Returns a Hello World message
 *   tags:
 *    - metrics
 *   responses:
 *    200:
 *     description: Hello World!
 *     content:
 *      application/json:
 *       schema:
 *        type: string
 *     example: /or
 *
 */
router.get('/metrics/ping', function (req, res) {
    res.send('Hello World!');
});
export { router as metricsRouter };
