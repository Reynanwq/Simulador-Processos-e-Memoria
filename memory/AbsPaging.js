class AbsPaging {
    constructor(processes, ramSize, pageSize, diskSize) {
        this.ram = new Memory(ramSize, pageSize);
        this.disk = new Memory(diskSize, pageSize);
        this.pageTable = new Map();
        this.pageNumMap = new Map();

        for (let i = 0; i < processes.length; i++) {
            const process = processes[i];
            this.disk.store(process.id, process.numPages);
            this.pageNumMap.set(process.id, process.numPages);
            this.pageTable.set(process.id, 0);
        }
    }

    loadProcessPages(processId) {
        throw new Error('loadProcessPages method must be implemented in subclasses');
    }

    ramToDisk(processId, numPages) {
        this.ram.release(processId, numPages);
        this.disk.store(processId, numPages);

        const previousNumPages = this.pageTable.get(processId);
        this.pageTable.set(processId, previousNumPages - numPages);
    }

    diskToRam(processId, numPages) {
        this.disk.release(processId, numPages);
        this.ram.store(processId, numPages);

        const previousNumPages = this.pageTable.get(processId);
        this.pageTable.set(processId, previousNumPages + numPages);
    }

    run(schedule) {
        const pagingData = [];
        let currProcess;

        for (let i = 0; i < schedule.length; i++) {
            currProcess = schedule[i];

            if (currProcess !== -1) this.loadProcessPages(schedule[i]);

            pagingData.push({
                step: i,
                executedProcess: currProcess,
                ram: [...this.ram.storage],
                disk: [...this.disk.storage],
            });
        }

        return pagingData;
    }
}