class Worker {
    id;
    process;
    commands;
    history;
    constructor(process, id) {
        this.id = id ? id : process.constructor.name;
        this.process = process;
        this.commands = new Array();
        this.history = new Array();
    }
}
export { Worker };
