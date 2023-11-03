class Escalonador {

    constructor(processosData) {
        this.processosData = processosData
        this.processos = processosData.processos

        this.num_processos = this.processos.length
        this.num_processos_executados = 0

        this.quantum = processosData.quantum
        this.sobrecarga = processosData.sobrecarga


        this.tempoAtual = 0
        this.timerSJF = 0

        this.cpu = []
        this.fila = []
    }

    /*************************************************************************************
     * 
     *                                       GERAL
     * 
     ************************************************************************************/

    /**
     * Inicializa o tempo atual como sendo o tempo de chegada do primeiro processo
     */
    inicializarTempoAtual(processo) {
        if (this.num_processos_executados == 0) {
            this.tempoAtual = processo.tempo_de_chegada
        }
    }

    /*************************************************************************************
     * 
     *                                       FIFO
     * 
     ************************************************************************************/

    async fifo(result) {
        let processos = this.processos
        let timer = 0
        while (this.num_processos_executados < this.num_processos) {
            for (const processo of processos) {
                if (processo.tempo_de_chegada == timer) {
                    this.executaFIFO(processo)
                }
            }
            timer++
        }

        let tempoTotal = 0
        for (const processo of this.processos) {
            tempoTotal += processo.tempo_total
        }
        this.processosData['tempo_medio'] = tempoTotal / this.num_processos
        this.num_processos_executados = 0
        return this.processosData;

    }

    /**
     * Execução do processo na CPU utilizando o FIFO
     */
    executaFIFO(processo) {
        this.inicializarTempoAtual(processo)

        let tempo_execucao = processo.tempo_de_execucao - 1
        let iteracao_final = tempo_execucao + this.tempoAtual

        while (this.tempoAtual <= iteracao_final) {
            processo.grafico[this.tempoAtual] = 'executando'
            processo.tempo_total = this.tempoAtual - processo.tempo_de_chegada + 1
            this.tempoAtual++
        }

        const label = processo.label
        for (let i = 0; i < this.processos.length; i++) {
            if (this.processos[i].label == label) {
                this.processos[i] = processo
            }
        }

        this.num_processos_executados++
        this.processosData.processos = this.processos
    }

    /*************************************************************************************
     * 
     *                                       SJF
     * 
     ************************************************************************************/

    sjf() {
        let processos = this.processos
        
        while (this.num_processos_executados < this.num_processos) {
            for (const processo of processos) {
                console.log(processo.label + " " + processo.tempo_de_chegada + " " + this.timerSJF)
                if (processo.tempo_de_chegada == this.timerSJF) {
                    this.fila.push(processo)
                }
            }

            if (this.fila.length > 0) {
                this.print(this.fila)
                let menor_processo = this.pegarProcessoMaisCurto(this.fila)
                this.executaSJF(menor_processo)
            }


            this.timerSJF++
        }

        let tempoTotal = 0
        for (const processo of this.processos) {
            tempoTotal += processo.tempo_total
        }
        this.processosData['tempo_medio'] = tempoTotal / this.num_processos
        return this.processosData;
    }

    /**
     * Retorna o processo mais curto da fila de prontos
     */
    pegarProcessoMaisCurto(fila_de_processos) {
        let menor_tempo = Infinity;
        let menor_processo = null;

        for (const processo of fila_de_processos) {
            if (processo.tempo_de_execucao < menor_tempo) {
                menor_tempo = processo.tempo_de_execucao;
                menor_processo = processo;
            }
        }
        return menor_processo
    }

    verificarSeAlgumProcessoPrecisaEntrarNaFila(tempoAtual, labelDoProcessoEmExecucao) {
        for (const processo of this.processos) {
            if (processo.tempo_de_chegada == tempoAtual && labelDoProcessoEmExecucao != processo.label) {
                this.fila.push(processo)
                this.timerSJF = tempoAtual
            }
        }
    }

    /**
     * Execução do processo na CPU utilizando SJF
     */
    executaSJF(processo) {
        this.inicializarTempoAtual(processo)

        let tempo_execucao = processo.tempo_de_execucao - 1
        let iteracao_final = tempo_execucao + this.tempoAtual

        while (this.tempoAtual <= iteracao_final) {
            processo.grafico[this.tempoAtual] = 'executando'
            processo.tempo_total = this.tempoAtual - processo.tempo_de_chegada + 1
            this.verificarSeAlgumProcessoPrecisaEntrarNaFila(this.tempoAtual, processo.label)
            this.tempoAtual++
        }

        const label = processo.label
        for (let i = 0; i < this.processos.length; i++) {
            if (this.processos[i].label == label) {
                this.processos[i] = processo
            }
        }

        this.num_processos_executados++
        this.processosData.processos = this.processos

        // Retira processo da fila de prontos, pois acabou de ser executado
        this.fila = this.fila.filter(p => p.label !== label);
    }

    /*************************************************************************************
     * 
     *                                     ROUND ROBIN
     * 
     ************************************************************************************/

    calcularRespostaRoundRobin() {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;
        var quantum = 2;

        processosData.sort(function (a, b) {
            return a.tempo_chegada - b.tempo_chegada;
        });

        for (var i = 0; i < num_processos; i++) {
            var chegada = processosData[i].tempo_chegada;
            tempoRespostaTotal += Math.min(chegada, i * quantum);
        }

        return tempoRespostaTotal / num_processos;
    }

    /*************************************************************************************
     * 
     *                                     EDF
     * 
     ************************************************************************************/

    calcularRespostaEDF() {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;

        processosData.sort(function (a, b) {
            return a.deadline - b.deadline;
        });

        for (var i = 0; i < num_processos; i++) {
            tempoRespostaTotal += processosData[i].tempo_chegada;
        }
        return tempoRespostaTotal / num_processos;
    }

    print(data) {
        console.log(JSON.stringify(data))
    }
}

