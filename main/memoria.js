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
        document.getElementById('titulo-ram').innerHTML = 'RAM';

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
                this.ram.push({ 'pagina': counter, 'processo': undefined, 'entrada': 0, 'contador': 0 })
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
                this.disco.push({ 'pagina': counter, 'processo': undefined, 'entrada': 0 })
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

    colocarPaginasDoProcessoNaRam(algoritmoTroca, labelProcesso) {
        if (algoritmoTroca == 'FIFO') {
            this.fifo(labelProcesso)
        }

        if (algoritmoTroca == 'LRU') {
            this.lru(labelProcesso)
        }

    }

    verificaSeProcessoEstaCompletamenteNaRam(label) {
        let numeroDePaginasDoProcesso = this.pegarNumeroDePaginasDoProcesso(label)
        let numeroDePaginasDoProcessoNaRam = this.pegarNumeroDePaginasDoProcessoNaRam(label)
        if (numeroDePaginasDoProcesso == numeroDePaginasDoProcessoNaRam) {
            return true
        } 
        return false
    }


    /*********************************************************************************************
     * 
     *                               LRU - Menos recentemente usada
     * 
     *********************************************************************************************/

    lru(labelProcesso) {
        let numeroPaginasParaAlocar = this.pegarNumeroDePaginasDoProcesso(labelProcesso)
        let numeroPaginasQueProcessoPossuiNaRam = this.pegarNumeroDePaginasDoProcessoNaRam(labelProcesso)
        numeroPaginasParaAlocar = numeroPaginasParaAlocar - numeroPaginasQueProcessoPossuiNaRam

        let menosUsadas = this.pegarPaginasMenosRecentementeUtilizadas(numeroPaginasParaAlocar)
        for (const menosUsada of menosUsadas) {
            for (const pagina of this.ram) {
                if (pagina['pagina'] == menosUsada) {
                    this.ram[menosUsada].processo = labelProcesso
                    this.ram[menosUsada].contador = this.ram[menosUsada].contador + 1
                }
            }
        }


        // for (let i = 0; i < this.numeroPaginasReais; i++) {
        //     let numeroPaginasLivre = this.numeroDePaginasLivreNaRam()
        //     if (numeroPaginasLivre == 0) {
        //         let posicao = this.encontrarPrimeiraOcorrenciaDoProcessoQueEntrouPrimeiro(labelProcesso)
        //         i = posicao
        //     }


        //     if (this.ram[i].processo == undefined || numeroPaginasLivre == 0) {
        //         this.ram[i].processo = labelProcesso
        //         this.ram[i].entrada = this.fifoTimerRAM
        //         this.ram[i].contador = this.ram[i].contador + 1
        //         numeroPaginasParaAlocar--
        //     }

        //     this.fifoTimerRAM++

        //     if (numeroPaginasParaAlocar == 0) {
        //         break
        //     }

        //     if (i == 49 && numeroPaginasParaAlocar > 0) {
        //         let posicao = this.encontrarPrimeiraOcorrenciaDoProcessoQueEntrouPrimeiro(labelProcesso)
        //         i = posicao
        //     }
        // }


        this.atualizarGraficoRam()
    }

    pegarPaginasMenosRecentementeUtilizadas(N) {
        const dadosOrdenados = [...this.ram];
        // Ordenar os dados com base no contador em ordem crescente
        dadosOrdenados.sort((a, b) => a.contador - b.contador);

        // Extrair as N páginas com os menores valores de contador após a ordenação
        return dadosOrdenados.slice(0, N).map(item => item.pagina);
    }

    /*********************************************************************************************
     * 
     *                                          FIFO
     * 
     *********************************************************************************************/

    fifo(labelProcesso) {
        let numeroPaginasParaAlocar = this.pegarNumeroDePaginasDoProcesso(labelProcesso)
        let numeroPaginasQueProcessoPossuiNaRam = this.pegarNumeroDePaginasDoProcessoNaRam(labelProcesso)
        numeroPaginasParaAlocar = numeroPaginasParaAlocar - numeroPaginasQueProcessoPossuiNaRam

        for (let i = 0; i < this.numeroPaginasReais; i++) {
            let numeroPaginasLivre = this.numeroDePaginasLivreNaRam()
            if (numeroPaginasLivre == 0) {
                let posicao = this.encontrarPrimeiraOcorrenciaDoProcessoQueEntrouPrimeiro(labelProcesso)
                i = posicao
            }


            if (this.ram[i].processo == undefined || numeroPaginasLivre == 0) {
                this.ram[i].processo = labelProcesso
                this.ram[i].entrada = this.fifoTimerRAM
                numeroPaginasParaAlocar--
            }

            this.fifoTimerRAM++

            if (numeroPaginasParaAlocar == 0) {
                break
            }

            if (i == 49 && numeroPaginasParaAlocar > 0) {
                let posicao = this.encontrarPrimeiraOcorrenciaDoProcessoQueEntrouPrimeiro(labelProcesso)
                i = posicao
            }
        }

        this.atualizarGraficoRam()
    }

    pegarNumeroDePaginasDoProcessoNaRam(processoLabel) {
        let counter = 0
        for (let pagina of this.ram) {
            if (processoLabel == pagina['processo']) {
                counter = counter + 1
            }
        }
        return counter
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

    pegarNumeroDePaginasDoProcesso(labelProcesso) {
        for (let processo of this.processos) {
            if (labelProcesso == processo['label']) {
                return processo['paginas']
            }
        }
    }

    numeroDePaginasLivreNaRam() {
        let paginasLivre = 0
        for (const [i, pagina] of this.ram.entries()) {
            if (pagina['processo'] == undefined) {
                paginasLivre++
            }
        }

        return paginasLivre;
    }


    encontrarProcessoQueEntrouPrimeiro(labelProcesso) {
        let menorTempo = Infinity;
        let processoMenorTempo = null;

        for (const dado of this.ram) {
            if ((dado.entrada < menorTempo) && dado.processo != labelProcesso) {
                menorTempo = dado.entrada;
                processoMenorTempo = dado.processo;
            }
        }

        return processoMenorTempo;
    }

    encontrarPrimeiraOcorrenciaDoProcessoQueEntrouPrimeiro(labelProcesso) {
        let labelPrimeiro = this.encontrarProcessoQueEntrouPrimeiro(labelProcesso)
        for (let pagina of this.ram) {
            if (labelPrimeiro == pagina['processo']) {
                return pagina['pagina']
            }
        }
    }


    generateUniqueId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 100000);
        const uniqueId = `${timestamp}${random}`;
        return uniqueId;
      }
      
      


    // fifo(labelProcesso) {
    //     let numeroPaginasDoProcesso = this.pegarNumeroDePaginasDoProcesso(labelProcesso)
    //     let numeroPaginasLivre = this.pegarNumeroDePaginasLivreNaRam()
    //     let paginasParaRetornarAoDisco = []


    //     let primeiroEntrar;
    //     if (numeroPaginasLivre == 0) {
    //         primeiroEntrar = this.encontrarProcessoQueEntrouPrimeiro(this.ram)
    //     }

    //     // Remove as páginas de RAM de acordo com as regras do FIFO
    //     while (numeroPaginasLivre < numeroPaginasDoProcesso) {
    //         for (const [i, pagina] of this.ram.entries()) {
    //             if (this.ram[i].processo == primeiroEntrar) {
    //                 if (this.ram[i].processo) {
    //                     paginasParaRetornarAoDisco.push(this.ram[i].processo)
    //                 }
    //                 this.ram[i].processo = labelProcesso
    //                 this.ram[i]['entrada'] = this.fifoTimerRAM
    //                 numeroPaginasLivre++
    //                 if (numeroPaginasLivre == numeroPaginasDoProcesso) {
    //                     break
    //                 }
    //             }
    //         }
    //     }

    //     // A páginas que foram removidas da RAM voltam para o disco
    //     for (let i = 0; i < paginasParaRetornarAoDisco.length; i++) {
    //         for (const[k, pagina] of this.disco.entries()) {
    //             if (this.disco[k]['processo'] == undefined) {
    //                 this.disco[k]['processo'] = paginasParaRetornarAoDisco[i]
    //                 paginasParaRetornarAoDisco.splice(i, 1);
    //             }
    //         }
    //     }


    //     // Adicionando páginas na RAM
    //     let paginasAdicionadas = 0
    //     for (const [i, pagina] of this.ram.entries()) {

    //         if (paginasAdicionadas == numeroPaginasDoProcesso) {
    //             break
    //         }

    //         if (labelProcesso == 'F') {
    //             console.log(labelProcesso + ' ' + this.fifoTimerRAM)
    //         }

    //         if (pagina['processo'] == undefined) {
    //             pagina['processo'] = labelProcesso
    //             this.ram[i]['processo'] = labelProcesso
    //             this.ram[i]['entrada'] = this.fifoTimerRAM
    //             paginasAdicionadas = paginasAdicionadas + 1
    //         }
    //         this.fifoTimerRAM++
    //     }

    //     // Removendo páginas do disco
    //     for (const[i, pagina] of this.disco.entries()) {
    //         if (pagina['processo'] == labelProcesso) {
    //             this.disco[i]['processo'] = undefined
    //         }
    //     }

    //     this.atualizarGraficoDisco()
    //     this.atualizarGraficoRam()

    // }

    // encontrarProcessoQueEntrouPrimeiro(paginas) {
    //     let menorTempo = Infinity;
    //     let processoMenorTempo = null;

    //     for (const dado of paginas) {
    //         if (dado.entrada < menorTempo) {
    //             menorTempo = dado.entrada;
    //             processoMenorTempo = dado.processo;
    //         }
    //     }

    //     return processoMenorTempo;
    // }

    // pegarValoresDaPagina(valor) {
    //     return valor.split(" ");
    // }

    // pegarNumeroDePaginasDoProcesso(labelProcesso) {
    //     for (let processo of this.processos) {
    //         if (labelProcesso == processo['label']) {
    //             return processo['paginas']
    //         }
    //     }
    // }


    // atualizarGraficoRam() {
    //     for (let i = 0; i < this.numeroPaginasReais; i++) {
    //         (document.getElementById('ram' + i)).innerHTML = i
    //     }

    //     for (let pagina of this.ram) {
    //         if (pagina['processo'])
    //             document.getElementById('ram' + pagina['pagina']).innerHTML = pagina['pagina'] + ' ' + pagina['processo']
    //     }
    // }

    // atualizarGraficoDisco() {
    //     for (let i = 0; i < this.numeroPaginasVirtuais; i++) {
    //         (document.getElementById('disco' + i)).innerHTML = i
    //     }

    //     for (let pagina of this.disco) {
    //         if (pagina['processo'])
    //             document.getElementById('disco' + pagina['pagina']).innerHTML = pagina['pagina'] + ' ' + pagina['processo']
    //     }
    // }

    // numeroDePaginasLivreNaRam() {
    //     let paginasLivre = 0
    //     for (const [i, pagina] of this.ram.entries()) {
    //         if (pagina['processo'] == undefined) {
    //             paginasLivre++
    //         }
    //     }

    //     return paginasLivre;
    // }

}