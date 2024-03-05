import express, { Request, Response } from 'express';

import { PodBay } from '../../db/index.js';
import { Component } from '../../utils/constants.js';
import { IdReference } from '../../utils/id.js';

const router = express.Router();
const podBay = new PodBay();

/**
 * @openapi
 * /api/v0/pods:
 *  get:
 *   tags:
 *    - pods
 *   description: Return the list of pods in the pod bay
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.get('/pods', async function(req: Request, res: Response) {
    const podIds = podBay.pods.map(pod => pod.id);
    const podComponents = podBay.pods.map(pod => pod.getComponents());

    const pods = podIds.map((id, index) => {
        return {
            pod: id.getId(),
            components: podComponents[index]
        }
    });

    res.send(
        pods
    );
});


/**
 * @openapi
 * /api/v0/pods:
 *  post:
 *   tags:
 *    - pods
 *   requestBody:
 *    description: Pod ID
 *    required: false
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "TestPod"
 *        component:
 *         type: string
 *         example: "ipfs"
 *   description: Creates a new pod
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 */
router.post('/pods', async function(req: Request, res: Response) {
    const id = req.body.id;
    const component = req.body.component ? req.body.component : Component.ORBITDB;
    await podBay.newPod(new IdReference({id, component: Component.POD}), component);
    res.send({
        message: `Pod created`,
        podId: id,
        component: component
    });
});


/**
 * @openapi
 * /api/v0/pods:
 *  delete:
 *   tags:
 *    - pods
 *   description: Delete a pod by ID
 *   requestBody:
 *    description: Pod ID
 *    required: false
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        id:
 *         type: string
 *         example: "TestPod"
 *   responses:
 *    200:
 *     description: A successful response
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *     example: /or
 * */
router.delete('/pods', async function(req: Request, res: Response) {
    const nodeId = req.body.id;
    await podBay.removePod(new IdReference({id: nodeId, component: Component.POD}));
    res.send({
        message: `Node deleted`,
        nodeId: nodeId
    });
});

// /**
//  * @openapi
//  * /api/v0/manage/nodes/{id}:
//  *  get:
//  *   tags:
//  *    - nodes
//  *   description: Get a node by ID
//  *   parameters:
//  *    - in: path
//  *      name: id
//  *      required: true
//  *      schema:
//  *       type: string
//  *      description: Node ID
//  *    - in: query
//  *      name: command
//  *      required: false
//  *      schema:
//  *       type: string
//  *      description: Command to execute  [ multiaddrs | ... ] 
//  *   responses:
//  *    200:
//  *     description: A successful response
//  *     content:
//  *      application/json:
//  *       schema:
//  *        type: object
//  *     example: /or
//  * */
// router.get('/manage/nodes/:id', async function(req: Request, res: Response) {
//     const nodeId = req.params.id;
//     const commandQuery = req.query.command;

//     const node = db.manager.getNode(nodeId);

//     if (!node) {
//         res.send({
//             message: `Node not found`,
//             nodeId: nodeId
//         });
//     }

//     if (!commandQuery) {
//         res.send({
//             nodeId: node?.id,
//             nodeType: node?.type,
//         });
//     }

//     if (commandQuery === 'multiaddrs') {
//         const command = new Command({
//             nodeId: nodeId,
//             type: Component.LIBP2P,
//             action: 'multiaddrs'
//         });
//         const multiaddrs = await db.executeCommand(command);
//         res.send({
//             nodeId: nodeId,
//             multiaddrs: multiaddrs.output
//         });
//     }
//     else {
//         res.send({
//             nodeId: nodeId,
//             nodeType: node?.type,
//             message: `Command not found: ${commandQuery}`
//         });
    
//     }

// });


export {
    router as podBayRouter
};