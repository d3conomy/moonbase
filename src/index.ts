import {
    ApiServer,
    ApiServerOptions
} from './api/index.js';


class Moonbase {
    public api: ApiServer;

    constructor(
        options?: ApiServerOptions
    ) {
        this.api = new ApiServer(options);
    }

    public init() {
        this.api.start();
    }
}

const moonbase = new Moonbase();
moonbase.init();

export {
    Moonbase,
    moonbase
}
