class Memory {
    constructor(type, totalFrames, pageSize, ramSize, diskSize) {
        this.type = type;
        this.totalFrames = totalFrames;
        this.pageSize = pageSize;
        this.ramSize = ramSize;
        this.diskSize = diskSize;

        this.ramFrames = Array(ramSize).fill(null); // Armazena as páginas atualmente na RAM
        this.diskPages = Array(diskSize).fill(null); // Armazena as páginas atualmente no Disco

        this.pageTable = {}; // Tabela de páginas para rastrear a localização das páginas
        this.ramUsage = [];
        this.diskUsage = [];
    }

    loadPage(processName, pageNum) {
        if (this.ramFrames.length < this.ramSize) {
            // Se ainda houver espaço na RAM, carregue a página diretamente
            this.ramFrames.push({ processName, pageNum });
            this.pageTable[`${processName}_${pageNum}`] = 'RAM';
        } else {
            // Caso contrário, aplique o algoritmo de substituição (FIFO ou LRU)
            const pageToReplace = this.pageReplacementAlgorithm();
            const { processName: oldProcess, pageNum: oldPageNum } = this.ramFrames[pageToReplace];

            // Move a página antiga para o disco
            this.diskPages.push({ processName: oldProcess, pageNum: oldPageNum });
            this.pageTable[`${oldProcess}_${oldPageNum}`] = 'DISK';

            // Carrega a nova página na RAM
            this.ramFrames[pageToReplace] = { processName, pageNum };
            this.pageTable[`${processName}_${pageNum}`] = 'RAM';
        }

        this.ramUsage.push([...this.ramFrames.map(page => (page ? `${page.processName}:${page.pageNum}` : 'empty'))]);
        this.diskUsage.push([...this.diskPages.map(page => (page ? `${page.processName}:${page.pageNum}` : 'empty'))]);
    }

    unloadPage(processName, pageNum) {
        const pageLocation = this.pageTable[`${processName}_${pageNum}`];
        if (pageLocation === 'RAM') {
            // Remove a página da RAM
            this.ramFrames = this.ramFrames.filter(page => !(page.processName === processName && page.pageNum === pageNum));
        } else if (pageLocation === 'DISK') {
            // Remove a página do disco
            this.diskPages = this.diskPages.filter(page => !(page.processName === processName && page.pageNum === pageNum));
        }

        this.ramUsage.push([...this.ramFrames.map(page => (page ? `${page.processName}:${page.pageNum}` : 'empty'))]);
        this.diskUsage.push([...this.diskPages.map(page => (page ? `${page.processName}:${page.pageNum}` : 'empty'))]);
    }

    isPageLoaded(processName, pageNum) {
        const pageLocation = this.pageTable[`${processName}_${pageNum}`];
        return pageLocation === 'RAM';
    }

    pageReplacementAlgorithm() {
        // Encontrar a página menos recentemente usada
        let lruIndex = 0;
        let lruTimestamp = this.pageTable[`${this.ramFrames[0].processName}_${this.ramFrames[0].pageNum}`];

        for (let i = 1; i < this.ramFrames.length; i++) {
            const currentPageTimestamp = this.pageTable[`${this.ramFrames[i].processName}_${this.ramFrames[i].pageNum}`];

            if (currentPageTimestamp < lruTimestamp) {
                lruIndex = i;
                lruTimestamp = currentPageTimestamp;
            }
        }

        return lruIndex;
    }


    printMemoryStatus() {
            console.log(`${this.type} Memory: [${this.ramFrames.map(page => (page ? `${page.processName}:${page.pageNum}` : 'empty')).join(', ')}]`);
  }

  printRealTimeUsage() {
      console.log(`${this.type} Real-Time Usage:`);
      for (let i = 0; i < this.ramUsage.length; i++) {
          console.log(`   RAM: [${this.ramUsage[i].join(', ')}], Disk: [${this.diskUsage[i].join(', ')}]`);
      }
  }
}