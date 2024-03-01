import express, { Request, Response } from 'express';

import { Db } from "../../db/index.js";
import { Command } from '../../db/commands.js';
import { Component } from '../../utils/constants.js';

const router = express.Router();
const db = new Db();

/**
 * @openapi
 * /api/v0/manage/init:
 *  get:
 *   tags:
 *    - nodes
 *   description: Initialize the database
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.get('/manage/init', async function(req: Request, res: Response) {
    await db.init();
    res.send({
        message: `Database initialized`
    });
});

/**
 * @openapi
 * /api/v0/manage/nodes:
 *  get:
 *   tags:
 *    - nodes
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


/**
 * @openapi
 * /api/v0/manage/nodes:
 *  post:
 *   tags:
 *    - nodes
 *   requestBody:
 *    description: Node ID
 *    required: false
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "myNode1"
 *        type:
 *         type: string
 *         example: "ipfs"
 *        dependency:
 *         type: string
 *         example: "libp2p"
 *   description: Create a new node
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 */
router.post('/manage/nodes', async function(req: Request, res: Response) {
    const nodeId = req.body.id;
    const nodeType = req.body.type;
    const nodeDependency = req.body.dependency;

    switch(nodeType) {
        case 'libp2p':
            await db.createLibp2pNode({
                libp2pNodeId: nodeId,
            });
            break;
        case 'ipfs':
            await db.createIPFSNode({
                ipfsNodeId: nodeId,
                libp2pNodeId: nodeDependency
            });
            break;
        case 'orbitdb':
            await db.createOrbitDbNode({
                orbitDbNodeId: nodeId,
                ipfsNodeId: nodeDependency
            });
            break;
    }
    res.send({
        message: `Node created`,
        nodeId: nodeId,
        nodeType: nodeType,
        nodeDependency: nodeDependency
    });
});


/**
 * @openapi
 * /api/v0/manage/nodes/{id}:
 *  delete:
 *   tags:
 *    - nodes
 *   description: Delete a node by ID
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: Node ID
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.delete('/manage/nodes/:id', async function(req: Request, res: Response) {
    const nodeId = req.params.id;
    await db.manager.closeNode(nodeId);
    res.send({
        message: `Node deleted`,
        nodeId: nodeId
    });
});

/**
 * @openapi
 * /api/v0/manage/nodes/{id}:
 *  get:
 *   tags:
 *    - nodes
 *   description: Get a node by ID
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: Node ID
 *    - in: query
 *      name: command
 *      required: false
 *      schema:
 *       type: string
 *      description: Command to execute  [ multiaddrs | ... ] 
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.get('/manage/nodes/:id', async function(req: Request, res: Response) {
    const nodeId = req.params.id;
    const commandQuery = req.query.command;

    const node = db.manager.getNode(nodeId);

    if (!node) {
        res.send({
            message: `Node not found`,
            nodeId: nodeId
        });
    }

    if (!commandQuery) {
        res.send({
            nodeId: node?.id,
            nodeType: node?.type,
        });
    }

    if (commandQuery === 'multiaddrs') {
        const command = new Command({
            nodeId: nodeId,
            type: Component.LIBP2P,
            action: 'multiaddrs'
        });
        const multiaddrs = await db.executeCommand(command);
        res.send({
            nodeId: nodeId,
            multiaddrs: multiaddrs.output
        });
    }
    else {
        res.send({
            nodeId: nodeId,
            nodeType: node?.type,
            message: `Command not found: ${commandQuery}`
        });
    
    }

});


export {
    router as managerRouter
};