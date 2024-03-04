import { LunarPod } from "./pod";
import { IdReference } from "../utils/id";



class Db {
    public pods: Array<LunarPod>;

    constructor(pods?: Array<LunarPod>) {
        this.pods = pods ? pods : new Array<LunarPod>();
    }

    public podIds(): Array<IdReference> {
        return this.pods.map(pod => pod.id);
    }

    public checkPodId(id: IdReference): boolean {
        return this.podIds().includes(id);
    }

    public newPod(): IdReference {
        const pod = new LunarPod({});
        this.addPod(pod);
        return pod.id;
    }

    public addPod(pod: LunarPod): void {
        if (!this.checkPodId(pod.id)) {
            this.pods.push(pod);
        }
        else {
            throw new Error(`Pod with id ${pod.id} already exists`);
        }
    }

    public getPod(id: string): LunarPod | undefined {
        return this.pods.find(pod => pod.id.id === id);
    }
}

export { Db };