class Escalonador {

    constructor(quantum, sobrecarga) {
        this.quantum = quantum
        this.sobrecarga = sobrecarga
        this.fila = [];
        this.cpu = [];
    }

    calcularRespostaFIFO(result) {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;

        processosData.sort(function(a, b) {
            return a.tempo_chegada - b.tempo_chegada;
        });

        for (var i = 0; i < num_processos; i++) {
            tempoRespostaTotal += processosData[i].tempo_chegada;
        }

        return tempoRespostaTotal / num_processos;
    }

    calcularRespostaSJF() {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;

        processosData.sort(function(a, b) {
            return a.tempo_execucao - b.tempo_execucao;
        });

        for (var i = 0; i < num_processos; i++) {
            tempoRespostaTotal += processosData[i].tempo_chegada;
        }

        return tempoRespostaTotal / num_processos;
    }

    calcularRespostaRoundRobin() {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;
        var quantum = 2;

        processosData.sort(function(a, b) {
            return a.tempo_chegada - b.tempo_chegada;
        });

        for (var i = 0; i < num_processos; i++) {
            var chegada = processosData[i].tempo_chegada;
            tempoRespostaTotal += Math.min(chegada, i * quantum);
        }

        return tempoRespostaTotal / num_processos;
    }

    calcularRespostaEDF() {
        var num_processos = processosData.length;
        var tempoRespostaTotal = 0;

        processosData.sort(function(a, b) {
            return a.deadline - b.deadline;
        });

        for (var i = 0; i < num_processos; i++) {
            tempoRespostaTotal += processosData[i].tempo_chegada;
        }
        return tempoRespostaTotal / num_processos;
    }
}

