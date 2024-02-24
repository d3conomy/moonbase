import express, { Request, Response } from 'express';

import { db, Db } from "../../db/index.js";

const router = express.Router();
/**
 * @openapi
 * /api/v0/manage/nodes:
 *  get:
 *   description: Get all nodes
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:  
 *       schema:
 *        type: object 
 *     example: /or
 * */
router.get('/manage/nodes', function(req: Request, res: Response) {
    db.manager.getAllNodes()

    const nodes = db.manager.getAllNodes().map((node) => node.id);
    
    res.send(nodes);
});

export {
    router as managerRouter
};