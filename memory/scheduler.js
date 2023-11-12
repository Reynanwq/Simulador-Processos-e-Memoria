class FIFOProcessScheduler {
    get name() {
        return "First In First Out (FIFO)";
    }

    run() {
        if (this.processes.length === 0) return;

        const process = this.processes[0];
        process.run();

        if (process.is_finished()) {
            this.remove_process(process);
        }

        const asleep_processes = this.processes.slice(1).map(asleep_process => {
            asleep_process.wait();
            return asleep_process;
        });

        return [process, asleep_processes, false];
    }
}

class RoundRobinProcessScheduler {
    constructor() {
        this.__process_running = null;
        this.__time_in_cpu = 0;
        this.__context_switching_time = Number.POSITIVE_INFINITY;
        this.__queue = [];
    }

    get name() {
        return "Round Robin (RR)";
    }

    add_process(process) {
        super.add_process(process);
        this.__queue.push(process);
    }

    remove_process(process) {
        super.remove_process(process);
        const index = this.__queue.indexOf(process);
        if (index !== -1) {
            this.__queue.splice(index, 1);
        }
    }

    run() {
        if (this.processes.length === 0) return;

        if (this.__time_in_cpu % this.quantum === 0) {
            if (this.__context_switching_time < this.context_switching) {
                this.__context_switching_time++;
                this.processes.forEach(process => process.wait());
                return [this.__process_running, this.__queue.slice(1), true];
            }

            this.__queue = this.__queue.slice(1).concat([this.__queue[0]]);
            this.__process_running = this.__queue[0];
            this.__context_switching_time = 0;
        }

        const process = this.__process_running;
        process.run();

        this.__time_in_cpu++;

        if (process.is_finished()) {
            this.remove_process(process);
            this.__context_switching_time = Number.POSITIVE_INFINITY;
            this.__time_in_cpu = 0;
        }

        const asleep_processes = this.processes
            .filter(asleep_process => asleep_process.id !== process.id)
            .map(asleep_process => {
                asleep_process.wait();
                return asleep_process;
            });

        return [process, asleep_processes, false];
    }
}

class SJFProcessScheduler {
    constructor() {
        this.__process_running = null;
    }

    get name() {
        return "Shortest Job First (SJF)";
    }

    remove_process(process) {
        super.remove_process(process);
        if (process === this.__running) {
            this.__process_running = null;
        }
    }

    run() {
        if (this.processes.length === 0) return;

        const processes = this.processes;
        let process = this.__process_running;

        if (process === null) {
            processes.sort((a, b) => a.duration - b.duration);
            process = processes[0];
        }

        process.run();
        this.__process_running = process;

        if (process.is_finished()) {
            this.remove_process(process);
        }

        const asleep_processes = processes
            .filter(asleep_process => asleep_process.id !== process.id)
            .map(asleep_process => {
                asleep_process.wait();
                return asleep_process;
            });

        return [process, asleep_processes, false];
    }
}

class FIFOMemoryManager {
    constructor() {
        this.virtualMemoryTable = {};
        this.realMemoryTable = Array(200).fill([undefined]); // Inicializa a RAM com 200 páginas vazias
    }

    get name() {
        return "First In First Out (FIFO)";
    }

    allocMemory(process, memory) {
        const virtualPageAddresses = this.allocMemoryHelper(process, memory);

        virtualPageAddresses.forEach((address) => {
            this.use(process, address);
        });

        return virtualPageAddresses;
    }

    use(process, virtualPageAddress) {
        if (!(process.id in this.virtualMemoryTable)) {
            throw new Error("Invalid process id.");
        }

        if (this.virtualMemoryTable[process.id][virtualPageAddress] !== null) {
            // A página já está na RAM e será utilizada.
            return;
        }

        // Verifica se há espaço livre na RAM e define a página para o processo.
        for (let realAddress = 0; realAddress < this.realMemoryTable.length; realAddress++) {
            if (this.realMemoryTable[realAddress][0] === undefined) {
                this.virtualMemoryTable[process.id][virtualPageAddress] = realAddress;
                this.setRealPage(process, realAddress);
                return;
            }
        }

        // Sobrescreve a página mais antiga criada.
        const sortedRealMemoryTable = this.realMemoryTable
            .map((page, index) => [index, page])
            .sort((pageA, pageB) => pageA[1] - pageB[1]);

        for (let realAddress = 0; realAddress < this.realMemoryTable.length; realAddress++) {
            if (this.realMemoryTable[realAddress] === sortedRealMemoryTable[0][1]) {
                // Apaga a referência da página de memória virtual que está atualmente na RAM.
                for (const [processId, virtualAddress] of Object.entries(this.virtualMemoryTable)) {
                    if (processId === sortedRealMemoryTable[0][0] && virtualAddress === realAddress) {
                        this.virtualMemoryTable[processId][virtualAddress] = null;
                        break;
                    }
                }

                // Define a referência para a página de memória virtual utilizada.
                this.virtualMemoryTable[process.id][virtualPageAddress] = realAddress;
                this.setRealPage(process, realAddress);
                return;
            }
        }
    }

    allocMemoryHelper(process, memory) {
        if (!(process.id in this.virtualMemoryTable)) {
            this.virtualMemoryTable[process.id] = {};
        }

        const virtualPageAddresses = Array.from({ length: memory }, (_, index) => index);
        return virtualPageAddresses;
    }

    setRealPage(process, realAddress) {
        // Lógica para definir a página real na RAM.
        this.realMemoryTable[realAddress] = [process.id];
    }
}


class EDFProcessScheduler {
    constructor() {
        this.__process_running = null;
        this.__time_in_cpu = 0;
        this.__context_switching_time = Number.POSITIVE_INFINITY;
        this.__queue = [];
    }

    get name() {
        return "Earliest Deadline First (EDF)";
    }

    run() {
        if (this.processes.length === 0) return;

        if (this.__time_in_cpu % this.quantum === 0) {
            if (this.__context_switching_time < this.context_switching) {
                this.__context_switching_time++;
                this.processes.forEach(process => process.wait());
                return [this.__process_running, this.__queue.slice(1), true];
            }

            this.__queue = this.processes.slice().sort((a, b) => a.deadline - a.duration);
            this.__process_running = this.__queue[0];
            this.__context_switching_time = 0;
        }

        const process = this.__process_running;
        process.run();

        this.__time_in_cpu++;

        if (process.is_finished()) {
            this.remove_process(process);
            this.__context_switching_time = Number.POSITIVE_INFINITY;
            this.__time_in_cpu = 0;
        }

        const asleep_processes = this.processes
            .filter(asleep_process => asleep_process.id !== process.id)
            .map(asleep_process => {
                asleep_process.wait();
                return asleep_process;
            });

        return [process, asleep_processes, false];
    }
}