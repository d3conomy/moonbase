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
 *    - pod bay
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
            pod: id,
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
 *    - pod bay
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
 *    - pod bay
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

/**
 * @openapi
 * /api/v0/pod/{id}:
 *  get:
 *   tags:
 *    - pod
 *   description: Get a node by ID
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      example: "TestPod"
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
router.get('/pod/:id', async function(req: Request, res: Response) {
    const podId = req.params.id;
    const command = req.query.command;
    const pod = podBay.getPod(new IdReference({id: podId, component: Component.POD}));

    if (command === 'multiaddrs') {
        res.send(
            pod?.libp2p?.getMultiaddrs()
        );
    } else {
        res.send(
            pod?.getComponents()
        );
    }
});


export {
    router as podBayRouter,
    podBay
};