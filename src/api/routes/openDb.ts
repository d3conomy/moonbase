import express, { Request, Response, NextFunction } from 'express';
import timeout from "connect-timeout"

import { podBay } from './podBay.js'
import { IdReference } from '../../utils/id.js';
import { Component } from '../../utils/constants.js';
import { OpenDb, _OpenDbOptions } from '../../db/open.js';


const router = express.Router();


/**
 * @openapi
 * /api/v0/db:
 *  get:
 *   tags:
 *    - db
 *   description: Return the list of open databases
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         databases:
 *          type: array
 *          items: 
 *           type: string
 *       examples:
 *        test:
 *         value: {databases: ["test"]}
 * */
router.get('/db', async function(req: Request, res: Response) {
    const dbNames = podBay.getAllOpenDbNames();

    res.send(
        {
            databases: dbNames
        }
    );
});


/**
 * @openapi
 * /api/v0/db:
 *  post:
 *   tags:
 *    - db
 *   requestBody:
 *    description: Database name and type
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        dbName:
 *         type: string
 *        dbType:
 *         type: string
 *      examples:
 *       openEvent:
 *        summary: Open an eventlog database
 *        value:
 *         dbName: "test-events"
 *         dbType: "events"
 *       openDocument:
 *        summary: Open a document database
 *        value:
 *         dbName: "test-documents"
 *         dbType: "documents"
 *       openKeyValue:
 *        summary: Open a key-value database
 *        value:
 *         dbName: "test-keyvalue"
 *         dbType: "keyvalue"
 *       openKeyValueIndexed:
 *        summary: Open a key-value indexed database
 *        value:
 *         dbName: "test-keyvalue-indexed"
 *         dbType: "keyvalueindexed"
 *   description: Open a database
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         database:
 *          type: string
 *       examples:
 *        test:
 *         value: {database: "test"}
 * */
router.post('/db', async function(req: Request, res: Response) {
    let orbitDbId = req.body.OrbitDbId;
    const dbName = req.body.dbName;
    const dbType = req.body.dbType;

    let orbitdb = podBay.getPod(new IdReference({id: orbitDbId, component: Component.ORBITDB}));

    if (!orbitdb) {
        let neworbitDbId = await podBay.newPod(new IdReference({id: orbitDbId, component: Component.POD}), Component.ORBITDB);
        orbitdb = podBay.getPod(neworbitDbId);
    }

    const db = await orbitdb?.initOpenDb({
        databaseName: dbName,
        databaseType: dbType
    })

    // The below code works but does not add the database to the pod
    // const db = await orbitdb?.orbitDb?.open({
    //     databaseName: dbName,
    //     databaseType: dbType
    // });

    res.send({
        database: db
    });
});

export { router as dbRouter }