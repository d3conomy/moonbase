import { OrbitDb , Database} from '@orbitdb/core';
import { Command } from '../db/commands.js';
import { ProcessTypes } from '../db/node.js';
import { Component, LogLevel } from '../utils/constants.js';
import { expect } from 'chai';
import { Manager } from '../db/manager.js';
import { logger } from '../utils/logBook.js';
import { Db } from '../db/index.js';
import { OpenDbOptions, OrbitDbTypes } from '../db/openDb.js';

describe('CommandsOpenDb', async () => {
    let command: Command;

    beforeEach(() => {
        //create the processInstance

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

    it('should create a new command instance', () => {
        expect(command.nodeId).to.be.equal('node1');
        expect(command.id).to.be.not.null;
        expect(command.type).to.be.equal(Component.DB);
        expect(command.action).to.be.equal('put');
        // expect(command.kwargs).to.equal(new Map<string, any>());
    });

    it('should set the output of the command', () => {
        command.setOutput('output1');
        expect(command.output).to.be.not.null;
    });

    it('should execute the command', async () => {
        let newDb = new Db();
        await newDb.init();

        const orbitDbNodes = newDb.manager.getNodesByType(Component.ORBITDB);

        const orbitDbNode = orbitDbNodes[0];
        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `OrbitDB node: ${JSON.stringify(orbitDbNode)}`
        });

        const openDbOptions = new OpenDbOptions({
            orbitDb: orbitDbNode,
            id: 'node1',
            databaseName: 'orbitDbNode',
            databaseType: OrbitDbTypes.DOCUMENTS,
        });

        let db = await newDb.open(openDbOptions)
        // while (!db.process) {
        //     await new Promise((resolve) => setTimeout(resolve, 1000));
        // }
        logger({
            level: LogLevel.INFO,
            component: Component.SYSTEM,
            message: `Db opened: ${db}`
        });
        // expect(db).to.be.not.null;

    // const db = newDb.opened.get('db1');
    // logger({
    //     level: LogLevel.INFO,
    //     component: Component.SYSTEM,
    //     message: `Db opened: ${db}`
    // });

    // expect(db).to.be.not.null;
    // while (!db.process) {
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
            const dbase = db?.database
            if (!dbase.process) {
                logger({
                    level: LogLevel.ERROR,
                    component: Component.SYSTEM,
                    message: `No OrbitDB node available`
                });
                return;
            }
            const result = await dbase.execute(command)
            command.setOutput(result);
            logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                message: `Command executed: ${command.id}, Output ${command.output}`
            });
            expect(command.output).to.be.not.null;
        }
        catch (error) {
            logger({
                level: LogLevel.ERROR,
                component: Component.SYSTEM,
                message: `Error executing command: ${error}`
            });
        }
    });
});