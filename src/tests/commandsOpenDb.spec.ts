import { OrbitDb , Database} from '@orbitdb/core';
import { Command } from '../db/commands.js';
import { Node, ProcessTypes } from '../db/node.js';
import { Component, LogLevel } from '../utils/constants.js';
import { expect } from 'chai';
import { Manager } from '../db/manager.js';
import { logger } from '../utils/logBook.js';
import { Db } from '../db/index.js';
import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

describe('CommandsOpenDb', async () => {
    let command: Command | null = null;
    let newDb: Db | null = null;
    let db: Node | null = null;

    beforeEach( async () => {
        //create the processInstance
        newDb = new Db();
        await newDb.init();

        let kwargs = new Map<string, string>();
        kwargs.set('key', 'hello')
        kwargs.set('value', 'world')

        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `Kwargs: ${JSON.stringify(kwargs.get('value'))},`
        });

        command = new Command({
            nodeId: 'node1',
            type: Component.DB,
            action: 'put',
            kwargs: kwargs
        });
    });

    afterEach(async () => {
        // Clean up any resources if needed
        if (db !== null) {
            await db.process.database.stop();
        }
        if (command) {
            command = null;
        }
        await newDb?.manager.closeAllNodes();
        newDb = null;
    });

    it('should create a new command instance', () => {
        expect(command).to.be.not.null;
        expect(command?.nodeId).to.be.equal('node1');
        expect(command?.id).to.be.not.null;
        expect(command?.type).to.be.equal(Component.DB);
        expect(command?.action).to.be.equal('put');
        // expect(command.kwargs).to.equal(new Map<string, any>());
    });

    it('should set the output of the command', () => {
        command?.setOutput('output1');
        expect(command?.output).to.be.not.null;
    });

    it('should open a database', async () => {

        const orbitDbNodes = newDb?.manager.getNodesByType(Component.ORBITDB);

        if (!orbitDbNodes) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                message: `OrbitDB node not found`
            });
            return;
        }
        const orbitDbNode = orbitDbNodes[0];

        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `OrbitDB node: ${JSON.stringify(orbitDbNode.id)}`
        });

        const openDbOptions = new OpenDbOptions({
            id: 'node1',
            orbitDb: orbitDbNode,
            databaseName: 'orbitDbNode',
            databaseType: OrbitDbTypes.EVENTS,
        });

        let db = await newDb?.open(openDbOptions)
        // while (!db?.process) {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        // }
        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `Db opened: ${db?.id}, ${db?.process.database.address}`
        });
        expect(db?.id).to.be.not.null;
    });

    it('should add a value to the database', async () => {
        const orbitDbNodes = newDb?.manager.getNodesByType(Component.ORBITDB);

        if (!orbitDbNodes) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                message: `OrbitDB node not found`
            });
            return;
        }
        const orbitDbNode = orbitDbNodes[0];

        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `OrbitDB node: ${JSON.stringify(orbitDbNode.id)}`
        });

        const openDbOptions = new OpenDbOptions({
            id: 'node1',
            orbitDb: orbitDbNode,
            databaseName: 'orbitDbNode',
            databaseType: OrbitDbTypes.EVENTS,
        });

        let db = await newDb?.open(openDbOptions)
        // try {
        //     const addCommand = new Command({
        //         nodeId: 'node1',
        //         type: Component.DB,
        //         action: 'add',
        //         kwargs: new Map<string, string>([['value', 'hello']])
        //     });

        //     await newDb?.executeCommand(addCommand);
        //     logger({
        //         level: LogLevel.INFO,
        //         component: Component.SYSTEM,
        //         message: `Value added to db: ${addCommand.output}`
        //     });
        //     expect(addCommand.output).to.be.not.null;
        // }
        // catch {
        //     logger({
        //         level: LogLevel.ERROR,
        //         component: Component.SYSTEM,
        //         message: `Error adding value to db`
        //     })
        // }

        const libp2pNode = orbitDbNode?.process?.ipfs.libp2p.getMultiaddrs();
        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `Libp2p node: ${JSON.stringify(libp2pNode)}`
        });

        // const output = await db?.process.add('hello');
        // logger({
        //     level: LogLevel.INFO,
        //     component: Component.SYSTEM,
        //     message: `Value added to db: ${output}`
        // });
    });
});