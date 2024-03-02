import { Libp2p } from "libp2p";
import { Libp2pProcess, _Libp2pOptions, createLibp2pProcess } from "./libp2p.js";
import { Helia, createHelia } from "helia";
import { Database, OrbitDB } from "@orbitdb/core";
import { Libp2pOptions } from "libp2p";
import { _IpfsOptions, IpfsProcess, createIpfsProcess } from "./ipfs.js";
import { Component } from "../utils/constants.js";
import { IdReference } from "../utils/id.js";
import { OrbitDbProcess, _OrbitDbOptions } from "./orbitDb.js";

class LunarPod {
    public id: IdReference;
    public libp2p?: Libp2pProcess;
    public ipfs?: IpfsProcess;
    public orbitDb?: OrbitDbProcess;
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
        orbitDb?: OrbitDbProcess,
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

//     public async initIpfs({
//         ipfsOptions
//     }: {
//         ipfsOptions?: _IpfsOptions
//     }): Promise<void> {
//         if (!this.ipfs) {
//             if (!this.libp2p) {
//                 await this.initLibp2p({});
//             }

//             if (ipfsOptions && !ipfsOptions.libp2p && this.libp2p) {
//                 ipfsOptions.libp2p = this.libp2p;
//             }
//             else {
//                 ipfsOptions = new _IpfsOptions({
//                     libp2p: this.libp2p
//                 });
//             }

//             this.ipfs = new IpfsProcess({
//                 id: new IdReference({
//                     component: Component.IPFS
//                 }),
//                 options: ipfsOptions
//             });
//         }
//         await this.ipfs.init();
//     }

//     public async initOrbitDb({
//         orbitDbOptions
//     }: {
//         orbitDbOptions?: _OrbitDbOptions
//     }): Promise<void> {
//         if (!this.orbitDb) {
//             this.orbitDb = new OrbitDbProcess({
//                 id: new IdReference({
//                     component: Component.ORBITDB
//                 }),
//                 options: orbitDbOptions
//             });
//         }
//         await this.orbitDb.init();
//     }
}


export { IdReference, LunarPod };