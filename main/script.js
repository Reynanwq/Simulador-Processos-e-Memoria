var processosData = [];

const fs = require('fs');

function criarArquivoJSON(algoritmo, jsonOutput) {
    const filePath = `./${algoritmo}_output.json`;

    fs.writeFile(filePath, jsonOutput, (err) => {
        if (err) throw err;
        console.log(`Arquivo ${algoritmo}_output.json criado.`);
    });
}

function adicionarProcessos() {
    var num_processos = parseInt(document.getElementById('num_processos').value);
    var quantum = parseInt(document.getElementById('qtd_quantum').value);
    var sobrecarga = parseInt(document.getElementById('sobrecarga').value);

    var processosDetailsHTML = '';

    for (var i = 0; i < num_processos; i++) {
        processosData.push({
            "quantum": quantum,
            "sobrecarga": sobrecarga,
            "deadline": 0,
            "tempo_chegada": 0,
            "tempo_execucao": 0
        });

        processosDetailsHTML += `
            <div>
                <h3>Processo ${i+1}</h3>
                <label for="deadline_time_${i}">DeadLine do Processo:</label>
                <input type="number" id="deadline_time_${i}"><br>

                <label for="time_chegada_${i}">Tempo de Chegada do Processo:</label>
                <input type="number" id="time_chegada_${i}"><br>

                <label for="execucao_tempo_${i}">Tempo de execucao do Processo:</label>
                <input type="number" id="execucao_tempo_${i}"><br>
            </div>
        `;
    }

    document.getElementById('processosDetails').innerHTML = processosDetailsHTML;

    document.getElementById('num_processos').disabled = true;
    document.getElementById('qtd_quantum').disabled = true;
    document.getElementById('sobrecarga').disabled = true;

    document.getElementById('processos').style.display = 'block';
    document.getElementById('jsonOutputFIFO').innerHTML = '';
    document.getElementById('jsonOutputSJF').innerHTML = '';
    document.getElementById('jsonOutputRR').innerHTML = '';
    document.getElementById('jsonOutputEDF').innerHTML = '';
}

function calcularRespostaFIFO() {
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

function calcularRespostaSJF() {
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

function calcularRespostaRoundRobin() {
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

function calcularRespostaEDF() {
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


function criarJSON(algoritmo) {
    var num_processos = processosData.length;

    for (var i = 0; i < num_processos; i++) {
        var deadline = parseInt(document.getElementById(`deadline_time_${i}`).value);
        var chegada = parseInt(document.getElementById(`time_chegada_${i}`).value);
        var execucao = parseInt(document.getElementById(`execucao_tempo_${i}`).value);

        processosData[i].deadline = deadline;
        processosData[i].tempo_chegada = chegada;
        processosData[i].tempo_execucao = execucao;
    }

    var result = {
        "sobrecarga": processosData[0].sobrecarga,
        "processos": {}
    };

    for (var i = 0; i < processosData.length; i++) {
        var label = String.fromCharCode(65 + i);
        result.processos[label] = {
            "grafico": {},
            "tempo_de_estouro_da_deadline": processosData[i].deadline,
            "tempo_de_chegada": processosData[i].tempo_chegada,
            "tempo_de_execucao": processosData[i].tempo_execucao,
            "quantum": processosData[i].quantum,
            "sobrecarga": processosData[i].sobrecarga
        };
    }

    var tempoRespostaMedio;

    if (algoritmo === 'FIFO') {
        tempoRespostaMedio = calcularRespostaFIFO();
    } else if (algoritmo === 'SJF') {
        tempoRespostaMedio = calcularRespostaSJF();
    } else if (algoritmo === 'Round Robin') {
        tempoRespostaMedio = calcularRespostaRoundRobin();
    } else if (algoritmo === 'EDF') {
        tempoRespostaMedio = calcularRespostaEDF();
    }

    result.tempo_resposta_medio = tempoRespostaMedio;


    var jsonOutput = JSON.stringify(result, null, 2);

    if (algoritmo === 'FIFO') {
        criarArquivoJSON('FIFO', jsonOutput);
        document.getElementById('jsonOutputFIFO').innerText = jsonOutput;
    } else if (algoritmo === 'SJF') {
        criarArquivoJSON('SJF', jsonOutput);
        document.getElementById('jsonOutputSJF').innerText = jsonOutput;
    } else if (algoritmo === 'Round Robin') {
        criarArquivoJSON('RR', jsonOutput);
        document.getElementById('jsonOutputRR').innerText = jsonOutput;
    } else if (algoritmo === 'EDF') {
        criarArquivoJSON('EDF', jsonOutput);
        document.getElementById('jsonOutputEDF').innerText = jsonOutput;
    }
}