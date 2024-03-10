import { MemoryDatastore } from "datastore-core";
import { MemoryBlockstore } from "blockstore-core";
import { Helia, createHelia} from "helia";
import { dagJson } from "@helia/dag-json";
import { dagCbor } from "@helia/dag-cbor";
import { CID } from "multiformats";
import { Component } from "../utils/index.js";
import { Libp2pProcess } from "./libp2p.js";
import { IdReference } from "../utils/id.js";
import { _BaseProcess, _Status, _IBaseProcess } from "./base.js";

class _IpfsOptions {
    libp2p: Libp2pProcess
    datastore: any
    blockstore: any
    start: boolean


    constructor({
        libp2p,
        datastore,
        blockstore,
        start,
    }: {
        libp2p?: Libp2pProcess,
        datastore?: any,
        blockstore?: any,
        start?: boolean
    }) {
        if (!libp2p) {
            throw new Error(`No Libp2p process found`)
        }
        this.libp2p = libp2p 
        this.datastore = datastore ? datastore : new MemoryDatastore()
        this.blockstore = blockstore ? datastore : new MemoryBlockstore()
        this.start = start ? start : false
    }
}

const createIpfsProcess = async (options: _IpfsOptions): Promise<Helia> => {
    return await createHelia({
        libp2p: options.libp2p.process,
        datastore: options.datastore,
        blockstore: options.blockstore,
        start: options.start
    })
}


class IpfsProcess 
    extends _BaseProcess
    implements _IBaseProcess
{
    public declare process?: Helia
    public declare options?: _IpfsOptions


    constructor({
        id,
        process,
        options
    }: {
        id?: IdReference,
        process?: Helia
        options?: _IpfsOptions
    }) {
        super({
            id: id,
            component: Component.IPFS,
            process: process,
            options: options as _IpfsOptions
        })
    }

    public async init(): Promise<void> {
        if (this.process !== undefined) {
            this.status = new _Status({
                // stage: this.process.libp2p.status,
                message: `Ipfs process initialized`
            });
            return;
        }

        if (!this.options) {
            throw new Error(`No Ipfs options found`)
        }
        
        if (!this.options.libp2p) {
            throw new Error(`No Libp2p process found`)
        }

        this.process = await createIpfsProcess(this.options)
    }

    public async start(): Promise<void> {
        if (this.process) {
            // await this.process.libp2p.start()
            await this.process.start()
            this.status?.update({message: `Ipfs process started`})
        }
    }

    public async stop(): Promise<void> {
        if (this.process) {
            await this.process.stop()
            await this.process.stop()
            this.status?.update({message: `Ipfs process stopped`})
        }
    }

    public async addJson(data: any): Promise<CID | Error | undefined> {
        if (this.process) {
            try {
                const dj = dagJson(this.process)
                return await dj.add(data);
            }
            catch (err: any) {
                return err
            }
        }
    }

    public async getJson(cid: string): Promise<any | Error | undefined> {
        let result: any
        if (this.process) {
            try {
                const dj = dagJson(this.process)
                return await dj.get(CID.parse(cid));
            }
            catch (err: any) {
                return err
            }
        }
    }
}

export {
    createIpfsProcess,
    _IpfsOptions,
    IpfsProcess
}
