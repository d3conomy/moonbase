import { ApiServer } from './api/index.js';
class Moonbase {
    api;
    constructor(options) {
        this.api = new ApiServer(options);
    }
    init() {
        this.api.start();
    }
}
const moonbase = new Moonbase();
moonbase.init();
export { Moonbase, moonbase };
