import { OrbitDb } from '@orbitdb/core';
import { Command, runCommand } from '../db/commands.js';
import { ProcessTypes } from '../db/node.js';
import { Component } from '../utils/constants.js';
import { expect } from 'chai';
import { Manager } from '../db/manager.js';

describe('Command', () => {
    let command: Command;

    beforeEach(() => {
        //create the processInstance

        command = new Command({
            nodeId: 'node1',
            type: Component.LIBP2P,
            call: 'peerInfo',
            kwargs: new Map<string, any>()
        });
    });

    it('should create a new command instance', () => {
        expect(command.nodeId).to.be.equal('node1');
        expect(command.id).to.be.not.null;
        expect(command.type).to.be.equal(Component.LIBP2P);
        expect(command.call).to.be.equal('peerInfo');
        // expect(command.kwargs).to.equal(new Map<string, any>());
    });

    it('should set the output of the command', () => {
        command.setOutput('output1');
        expect(command.output).to.be.not.null;
    });
});

