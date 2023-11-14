/* Implementa um gerenciador de memória FIFO (First In First Out). Ele simula a alocação e desalocação de páginas de memória virtual em um sistema operacional. O gerenciador mantém tabelas de mapeamento entre memória virtual e real, e utiliza a política FIFO para decidir quais páginas substituir quando a RAM está cheia. O código inclui métodos para alocar memória para processos, utilizar páginas na RAM e definir páginas reais na RAM, seguindo a lógica FIFO.*/

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