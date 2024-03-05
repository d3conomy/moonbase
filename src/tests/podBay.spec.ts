import { PodBay } from "../db/index.js";
import { LunarPod } from "../db/pod.js";
import { expect } from "chai";

describe('PodBay', async () => {
    let db: PodBay;

    it('should create a new PodBay instance', async () => {
        db = new PodBay();
        expect(db).to.be.not.null;
        expect(db.pods).to.be.not.null;
        expect(db.pods).to.be.an('array');
    });

    it('should add a new pod', async () => {
        const pod = new LunarPod({});
        db.addPod(pod);
        expect(db.pods).to.include(pod);
    });

    it('should get a pod by id', async () => {
        const pod = new LunarPod({});
        db.addPod(pod);
        const podId = pod.id;
        expect(db.getPod(podId)).to.be.equal(pod);
    });

    it('should remove a pod by id', async () => {
        const pod = new LunarPod({});
        db.addPod(pod);
        const podId = pod.id;
        await db.removePod(podId);
        expect(db.pods).to.not.include(pod);
    });

    it('should fail removing a pod by id if the pod does not exist', async () => {
        const pod = new LunarPod({});
        db.addPod(pod);
        const podId = pod.id;
        await db.removePod(podId);
        const removedPod = db.getPod(podId);
        expect(removedPod).to.be.undefined;
    });

    it('should fail adding a pod with an existing id', async () => {
        const pod = new LunarPod({});
        db.addPod(pod);
        expect(() => db.addPod(pod)).to.throw(`Pod with id ${pod.id} already exists`);
    });

    it('should create a new pod', async () => {
        const podId = db.newPod();
        expect(db.pods).to.include(db.getPod(podId));
    });
});