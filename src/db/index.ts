import { LunarPod } from "./pod.js";
import { IdReference } from "../utils/id.js";
import { logger } from "../utils/logBook.js";
import { LogLevel } from "../utils/constants.js";



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

    public getPod(id: IdReference): LunarPod | undefined {
        return this.pods.find(pod => pod.id === id);
    }

    public async removePod(id: IdReference): Promise<void> {
        const pod = this.getPod(id);
        if (pod) {
            await pod.stop();
            const index = this.pods.indexOf(pod);
            this.pods.splice(index, 1);
            logger({
                level: LogLevel.INFO,
                message: `Pod with id ${id.getId()} removed`
            });
        }
        else {
            throw new Error(`Pod with id ${id.getId()} not found`);
        }
    }
}

export { Db };