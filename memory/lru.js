/*implementa um gerenciador de memória LRU (Least Recently Used). Ele simula a alocação e desalocação de páginas de memória virtual em um sistema operacional. O gerenciador mantém tabelas de mapeamento entre memória virtual e real, e utiliza a política LRU para decidir quais páginas substituir quando a RAM está cheia. O código inclui métodos para alocar memória para processos, utilizar páginas na RAM e definir páginas reais na RAM, seguindo a lógica LRU baseada em contadores de uso.*/

class LRUMemoryManager {
    constructor() {
        this.virtualMemoryTable = {};
        this.realMemoryTable = Array(200).fill([undefined]); // Inicializa a RAM com 200 páginas vazias
        this.pageUsageCounter = Array(200).fill(0); // Contador de uso das páginas
    }

    get name() {
        return "Least Recently Used (LRU)";
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
            this.pageUsageCounter[this.virtualMemoryTable[process.id][virtualPageAddress]]++;
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

        // Sobrescreve a página menos recentemente utilizada.
        const leastUsedPage = this.pageUsageCounter.indexOf(Math.min(...this.pageUsageCounter));
        const replacedProcessId = this.realMemoryTable[leastUsedPage][0];

        // Apaga a referência da página de memória virtual que está atualmente na RAM.
        for (const [processId, virtualAddress] of Object.entries(this.virtualMemoryTable)) {
            if (processId === replacedProcessId && virtualAddress === leastUsedPage) {
                this.virtualMemoryTable[processId][virtualAddress] = null;
                break;
            }
        }

        // Define a referência para a página de memória virtual utilizada.
        this.virtualMemoryTable[process.id][virtualPageAddress] = leastUsedPage;
        this.setRealPage(process, leastUsedPage);
        this.pageUsageCounter[leastUsedPage] = 1;
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