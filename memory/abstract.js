class MemoryManager {
    constructor(ramMemorySize, pageSize, pagePerProcess = null) {
        this.ramMemorySize = ramMemorySize;
        this.pageSize = pageSize;
        this.pagePerProcess = pagePerProcess;
        this.ramMemoryPages = Math.floor(ramMemorySize / pageSize);

        this.realMemoryTable = Array.from({ length: this.ramMemoryPages }, () => [null, null, new Date(), new Date()]);
        this.virtualMemoryTable = new Map();
        this.incrementedVirtualPageAddress = 0;
    }

    get name() {
        return "";
    }

    _setRealPage(process, realMemoryAddress) {
        this.realMemoryTable[realMemoryAddress] = [process, null, new Date(), new Date()];
        this._use(process, realMemoryAddress);

        // Garante que todas as páginas possuirão um tempo de criação diferente.
        setTimeout(() => {}, 10);
    }

    _use(process, realMemoryAddress, newValue = null) {
        const [registeredProcess, value, createdAt, lastUsedAt] = this.realMemoryTable[realMemoryAddress];

        if (process.id !== registeredProcess.id) {
            throw new Error("Illegal access for this memory page.");
        }

        if (newValue !== null) {
            this.realMemoryTable[realMemoryAddress] = [process, newValue, createdAt, new Date()];
        } else {
            this.realMemoryTable[realMemoryAddress] = [process, value, createdAt, new Date()];
        }

        return value;
    }

    allocMemory(process, memory, { dryRun = false } = {}) {
        const memoryAddresses = [];

        const totalUsed =
            memory + [...this.virtualMemoryTable.values()]
            .filter(([pid]) => pid === process.id)
            .reduce((acc, [, vmemAddr]) => acc + this.pageSize, 0);

        if (totalUsed > this.pagePerProcess * this.pageSize || totalUsed > this.ramMemoryPages * this.pageSize) {
            throw new Error("Max amount of memory page exceeded.");
        }

        if (dryRun) {
            return [];
        }

        while (memory > 0) {
            const virtualAddress = this.incrementedVirtualPageAddress;
            this.incrementedVirtualPageAddress += 1;

            this.virtualMemoryTable.set([process.id, virtualAddress], null);
            memoryAddresses.push(virtualAddress);

            memory -= this.pageSize;
        }

        return memoryAddresses;
    }

    freeMemory(process) {
        const keysToRemove = [];

        for (const [key, value] of this.virtualMemoryTable.entries()) {
            if (key[0] === process.id && value !== null) {
                this.realMemoryTable[value] = [process, null, new Date(), new Date()];
                keysToRemove.push(key);
            }
        }

        for (const key of keysToRemove) {
            this.virtualMemoryTable.delete(key);
        }
    }

    getVirtualMemoryTable() {
        const table = [];

        for (const [key, value] of this.virtualMemoryTable.entries()) {
            let lastUsedAt = null;

            if (value !== null) {
                const [, , , lastUsedDate] = this.realMemoryTable[value];
                lastUsedAt = lastUsedDate.toLocaleString("en-US");
            }

            table.push([key[0], key[1], value, lastUsedAt]);
        }

        return table;
    }

    hasPageFault(process) {
        for (const [key, value] of this.virtualMemoryTable.entries()) {
            if (key[0] === process.id && value === null) {
                return true;
            }
        }

        return false;
    }

    use(process, memoryPageAddress) {
        // Placeholder for the abstract method.
    }
}

// Example usage:
const memoryManager = new MemoryManager(1024, 128, 4);
console.log(memoryManager.ramMemoryPages); // Example property access