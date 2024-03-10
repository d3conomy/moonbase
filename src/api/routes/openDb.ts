import express, { Request, Response, NextFunction } from 'express';
import timeout from "connect-timeout"

import { podBay } from './podBay.js'
import { IdReference } from '../../utils/id.js';
import { Component } from '../../utils/constants.js';
import { OpenDb, _OpenDbOptions } from '../../db/open.js';
import { operation } from '../../db/command.js';


const router = express.Router();


/**
 * @openapi
 * /api/v0/open:
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
router.get('/open', async function(req: Request, res: Response) {
    const dbNames = podBay.getAllOpenDbNames();

    res.send({
        databases: dbNames
    });
});


/**
 * @openapi
 * /api/v0/open:
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
 *         id:
 *          type: string
 *         type:
 *          type: string
 *         address:
 *          type: string
 *       examples:
 *        test:
 *         value: {id: "test-events", type: "events", address: "/orbitdb/QmTest/test"}
 * */
router.post('/open', async function(req: Request, res: Response) {
    let orbitDbId = req.body.OrbitDbId;
    const dbName = req.body.dbName;
    const dbType = req.body.dbType;
    const options = req.body.options;

    const db = await podBay.openDb({
        orbitDbId,
        dbName,
        dbType,
        options
    });

    if (!db) {
        res.status(500).send(`Database ${dbName} not opened`);
    }

    res.send({
        id: db?.id.name,
        type: db?.options?.databaseType,
        address: db?.address(),
    });
});


/**
 * @openapi
 * /api/v0/db/{id}:
 *  get:
 *   tags:
 *    - db
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: The database ID
 *      schema:
 *       type: string
 *       example: "test-events"
 *   description: Return the database details
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         id:
 *          type: string
 *         type:
 *          type: string
 *         address:
 *          type: string
 *       examples:
 *        test:
 *         value: {id: "test", type: "events", address: "/orbitdb/QmTest/test"}
 * */
router.get('/db/:id', async function(req: Request, res: Response) {
    const id = req.params.id;

    const db = podBay.getOpenDb(new IdReference({id, component: Component.DB}));

    if (!db) {
        res.status(404).send(`Database ${id} not found`);
    }
    else {
        res.send({
            id: db.id.name,
            type: db.options?.databaseType,
            address: db.address(),
        });
    }

});


/**
 * @openapi
 * /api/v0/db/{id}:
 *  post:
 *   tags:
 *    - db
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      description: The database ID
 *      schema:
 *       type: string
 *       example: "test-events"
 *   requestBody:
 *    description: Database command and arguments
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        command:
 *         type: string
 *        args:
 *         type: object
 *      examples:
 *       add:
 *        summary: Add a record to the database
 *        value:
 *         command: "add"
 *         args: {key: "test", value: "test"}
 *       get:
 *        summary: Get a record from the database
 *        value:
 *         command: "get"
 *         args: {key: "test"}
 *       del:
 *        summary: Delete a record from the database
 *        value:
 *         command: "del"
 *         args: {key: "test"}
 *   description: Execute a command on the database
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *       examples:
 *        test:
 *         value: {key: "test", value: "test"}
 * */
router.post('/db/:id', async function(req: Request, res: Response) {
    const id = req.params.id;
    const command = req.body.command;
    const args = req.body.args;

    const db = podBay.getOpenDb(new IdReference({id, component: Component.DB}));

    if (!db) {
        res.status(404).send(`Database ${id} not found`);
    }
    else {
        let result: any;
        try {
            result = await operation({
                openDb: db, 
                command: command,
                args: args
            })
        }
        catch (e: any) {
            result = {
                message: `Command failed`,
                dbId: id,
                command: command,
                error: e.message
            }
        }
        res.send(result);
    }
});

export { router as dbRouter }