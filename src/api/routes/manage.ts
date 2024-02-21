import express, { Request, Response } from 'express';

const router = express.Router();
/**
 * @openapi
 * /api/v0/manage/nodes:
 *  get:
 *   description: Get all nodes
 *   responses:
 *    '200':
 *     description: A successful response
 *      content:
 *       application/json:  
 *        schema:
 *         type: object
 *         properties:
 *          nodes:
 *           type: array
 *           items:  
 * 
 * */
router.get('/manage/nodes', function(req: Request, res: Response) {
    res.send('Manage Nodes');
});

export {
    router as managerRouter
};