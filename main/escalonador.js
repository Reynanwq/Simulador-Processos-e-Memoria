class Escalonador {

    constructor(processosData) {
        this.processosData = processosData
        this.processos = processosData.processos

        this.num_processos = this.processos.length
        this.num_processos_executados = 0

        this.quantum = processosData.quantum
        this.sobrecarga = processosData.sobrecarga
        

        this.tempoAtual = 0

        this.cpu = []
        this.fila = []
    }

    async calcularRespostaFIFO(result) {
        let processos = this.processos
        let timer = 0
        while (this.num_processos_executados < this.num_processos) {
            // await new Promise(resolve => setTimeout(resolve, 1000));

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
        return this.processosData;

    }

    executaFIFO(processo) {
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

    calcularRespostaSJF() {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;

        processosData.sort(function (a, b) {
            return a.tempo_execucao - b.tempo_execucao;
        });

        for (var i = 0; i < num_processos; i++) {
            tempoRespostaTotal += processosData[i].tempo_chegada;
        }

        return tempoRespostaTotal / num_processos;
    }


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

