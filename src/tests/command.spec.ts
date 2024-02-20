import { OrbitDb } from '@orbitdb/core';
import { Command } from '../db/commands.js';
import { ProcessTypes } from '../db/node.js';
import { Component, LogLevel } from '../utils/constants.js';
import { expect } from 'chai';
import { Manager } from '../db/manager.js';
import { logger } from '../utils/logBook.js';

describe('Command', () => {
    let command: Command;

    beforeEach(() => {
        //create the processInstance

        command = new Command({
            nodeId: 'node1',
            type: Component.LIBP2P,
            action: 'peerInfo',
            kwargs: new Map<string, any>()
        });
    });

    it('should create a new command instance', () => {
        expect(command.nodeId).to.be.equal('node1');
        expect(command.id).to.be.not.null;
        expect(command.type).to.be.equal(Component.LIBP2P);
        expect(command.action).to.be.equal('peerInfo');
        // expect(command.kwargs).to.equal(new Map<string, any>());
    });

    it('should set the output of the command', () => {
        command.setOutput('output1');
        expect(command.output).to.be.not.null;
    });

    it('should execute the command', async () => {
        const manager = new Manager();
        await manager.createNode({
            id: 'node1',
            type: Component.LIBP2P
        });
        const node = manager.getNode('node1');
        expect(node).to.be.not.null;
        while (!node?.process) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        const result = await node?.execute(command);
            command.setOutput(result);
            logger({
                level: LogLevel.INFO,
                component: Component.SYSTEM,
                message: `Command executed: ${command.id}, Output ${command.output}`
            });
            expect(command.output).to.be.not.null;
        });
    });

