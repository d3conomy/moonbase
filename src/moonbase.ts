import { Libp2p } from "libp2p";
import { Libp2pProcess, _Libp2pOptions, createLibp2pProcess } from "./db/setupLibp2p.js";
import { Helia, createHelia } from "helia";
import { Database, OrbitDB } from "@orbitdb/core";
import { Libp2pOptions } from "libp2p";
import { IpfsOptions, IpfsProcess, createIpfsProcess } from "./db/setupIpfs.js";
import { Component } from "./utils/constants.js";

class IdReference {
    public id: string;
    public component: Component;

    constructor({
        component,
        id,
    }: {
        component: Component
        id?: string,
    }) {
        this.component = component;
        if (id) {
            this.id = id;
        }
        else {
            this.id = this.randomId();
        }
    }

    public getId(): string {
        return this.id;
    }

    public randomId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

class LunarPod {
    public id: IdReference;
    public libp2p?: Libp2pProcess;
    public ipfs?: IpfsProcess;
    public orbitDb?: typeof OrbitDB;
    public db?: typeof Database;

    constructor({
        id,
        libp2p,
        ipfs,
        orbitDb,
        db
    }: {
        id?: IdReference,
        libp2p?: Libp2pProcess,
        ipfs?: IpfsProcess,
        orbitDb?: typeof OrbitDB,
        db?: typeof Database
    }) {
        this.id = id ? id : new IdReference({ component: Component.POD });
        this.libp2p = libp2p;
        this.ipfs = ipfs;
        this.orbitDb = orbitDb;
        this.db = db;
    }

    public async initLibp2p({
        libp2pOptions
    }: {
        libp2pOptions?: _Libp2pOptions,
    }): Promise<void> {
        if (!this.libp2p) {
            this.libp2p = new Libp2pProcess({
                id: new IdReference({
                    component: Component.LIBP2P
                }),
                options: libp2pOptions
            });
        }
        await this.libp2p.init();
    }

    public async initIpfs({
        ipfsOptions
    }: {
        ipfsOptions?: IpfsOptions
    }): Promise<void> {
        if (!this.ipfs) {
            this.ipfs = new IpfsProcess({
                id: new IdReference({
                    component: Component.IPFS
                }),
                options: ipfsOptions
            });
        await this.ipfs.init();
        }
    }
}


export { IdReference, LunarPod };