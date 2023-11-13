class Memoria {

    constructor(processos) {
        this.tamanhoRAM = 200
        this.tamanhoPaginaReal = 4
        this.numeroPaginasReais = this.tamanhoRAM / this.tamanhoPaginaReal

        this.ram = []
        this.disco = []

        this.maximodePaginasPorProcesso = 10
        this.maximoDeProcessosNaRam = this.numeroPaginasReais / this.maximodePaginasPorProcesso

        this.processos = processos

        this.numeroPaginasVirtuais = 120

        this.fifoTimerRAM = 0

    }

    criarMemoriaRam() {
        const ram = document.getElementById('ram');
        ram.innerHTML = "";

        let counter = 0
        for (let i = 0; i < 5; i++) {
            const fila = document.createElement('div');
            fila.classList.add('fila');

            for (let j = 0; j < 10; j++) {
                const pagina = document.createElement('div');
                pagina.classList.add('pagina');
                fila.appendChild(pagina);
                pagina.innerHTML = counter
                pagina.id = 'ram' + counter
                this.ram.push({'pagina': counter, 'processo': undefined, 'entrada': 0})
                counter++
            }

            ram.appendChild(fila);
        }
    }

    criarDisco() {
        const disco = document.getElementById('disco');
        disco.innerHTML = "";
        let counter = 0
        for (let i = 0; i < 10; i++) {
            const fila = document.createElement('div');
            fila.classList.add('fila');

            for (let j = 0; j < 12; j++) {
                const pagina = document.createElement('div');
                pagina.classList.add('pagina');
                fila.appendChild(pagina);
                pagina.innerHTML = counter
                pagina.id = 'disco' + counter
                this.disco.push({'pagina': counter, 'processo': undefined, 'entrada': 0})
                counter++
            }

            disco.appendChild(fila);
        }
    }

    async adicionarPaginasNoDisco(processos) {
        let counter = 0
        for (let processo of processos) {
            let numeroPaginas = processo['paginas']
            for (let i = 0; i < numeroPaginas; i++) {
                this.disco[counter].processo = processo['label']
                counter = counter + 1
            }
        }

        this.atualizarGraficoDisco()
    }

    

    fifo(labelProcesso) {
        let numeroPaginasDoProcesso = this.pegarNumeroDePaginasDoProcesso(labelProcesso)
        let numeroPaginasLivre = this.pegarNumeroDePaginasLivreNaRam()
        let paginasParaRetornarAoDisco = []


        let primeiroEntrar;
        if (numeroPaginasLivre == 0) {
            primeiroEntrar = this.encontrarProcessoQueEntrouPrimeiro(this.ram)
        }

        // Remove as páginas de RAM de acordo com as regras do FIFO
        while (numeroPaginasLivre < numeroPaginasDoProcesso) {
            for (const [i, pagina] of this.ram.entries()) {
                if (this.ram[i].processo == primeiroEntrar) {
                    if (this.ram[i].processo) {
                        paginasParaRetornarAoDisco.push(this.ram[i].processo)
                    }
                    this.ram[i].processo = labelProcesso
                    this.ram[i]['entrada'] = this.fifoTimerRAM
                    numeroPaginasLivre++
                    if (numeroPaginasLivre == numeroPaginasDoProcesso) {
                        break
                    }
                }
            }
        }

        // A páginas que foram removidas da RAM voltam para o disco
        for (let i = 0; i < paginasParaRetornarAoDisco.length; i++) {
            for (const[k, pagina] of this.disco.entries()) {
                if (this.disco[k]['processo'] == undefined) {
                    this.disco[k]['processo'] = paginasParaRetornarAoDisco[i]
                    paginasParaRetornarAoDisco.splice(i, 1);
                }
            }
        }


        // Adicionando páginas na RAM
        let paginasAdicionadas = 0
        for (const [i, pagina] of this.ram.entries()) {

            if (paginasAdicionadas == numeroPaginasDoProcesso) {
                break
            }

            if (labelProcesso == 'F') {
                console.log(labelProcesso + ' ' + this.fifoTimerRAM)
            }
        
            if (pagina['processo'] == undefined) {
                pagina['processo'] = labelProcesso
                this.ram[i]['processo'] = labelProcesso
                this.ram[i]['entrada'] = this.fifoTimerRAM
                paginasAdicionadas = paginasAdicionadas + 1
            }
            this.fifoTimerRAM++
        }

        // Removendo páginas do disco
        for (const[i, pagina] of this.disco.entries()) {
            if (pagina['processo'] == labelProcesso) {
                this.disco[i]['processo'] = undefined
            }
        }

        this.atualizarGraficoDisco()
        this.atualizarGraficoRam()
        
    }

    encontrarProcessoQueEntrouPrimeiro(paginas) {
        let menorTempo = Infinity;
        let processoMenorTempo = null;
    
        for (const dado of paginas) {
            if (dado.entrada < menorTempo) {
                menorTempo = dado.entrada;
                processoMenorTempo = dado.processo;
            }
        }
    
        return processoMenorTempo;
    }

    colocarPaginasDoProcessoNaRam(algoritmoTroca, labelProcesso) {
        if (algoritmoTroca == 'FIFO') {
            this.fifo(labelProcesso)
        }

    }

    verificaSeProcessoEstaNaRam(label) {
        for (let pagina of this.ram) {
            if (pagina['processo'] == label) {
                return true
            }
        }

        return false
    }

    pegarValoresDaPagina(valor) {
        return valor.split(" ");
    }

    pegarNumeroDePaginasDoProcesso(labelProcesso) {
        for (let processo of this.processos) {
            if (labelProcesso == processo['label']) {
                return processo['paginas']
            }
        }
    }


    atualizarGraficoRam() {
        for (let i = 0; i < this.numeroPaginasReais; i++) {
            (document.getElementById('ram' + i)).innerHTML = i
        }

        for (let pagina of this.ram) {
            if (pagina['processo'])
                document.getElementById('ram' + pagina['pagina']).innerHTML = pagina['pagina'] + ' ' + pagina['processo']
        }
    }

    atualizarGraficoDisco() {
        for (let i = 0; i < this.numeroPaginasVirtuais; i++) {
            (document.getElementById('disco' + i)).innerHTML = i
        }

        for (let pagina of this.disco) {
            if (pagina['processo'])
                document.getElementById('disco' + pagina['pagina']).innerHTML = pagina['pagina'] + ' ' + pagina['processo']
        }
    }

    pegarNumeroDePaginasLivreNaRam() {
        let paginasLivre = 0
        for (const [i, pagina] of this.ram.entries()) {
            if (pagina['processo'] == undefined) {
                paginasLivre++
            }
        }

        return paginasLivre;
    }

}