var processosData = [];


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
            <div class="row">
                <div class="col">
                    <h3>Processo ${i+1}</h3>
                </div>
                <div class="col">
                    <label for="deadline_time_${i}">Deadline:</label>
                    <input type="number" id="deadline_time_${i}" class="form-control">
                </div>
                <div class="col">
                    <label for="time_chegada_${i}">Tempo de chegada:</label>
                    <input type="number" id="time_chegada_${i}" class="form-control">
                </div>
                <div class="col">
                    <label for="execucao_tempo_${i}">Tempo de execução:</label>
                    <input type="number" id="execucao_tempo_${i}" class="form-control">
                </div>
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



function criarJSON(algoritmo) {
    var quantum = parseInt(document.getElementById('qtd_quantum').value);
    var sobrecarga = parseInt(document.getElementById('sobrecarga').value);
    var result = {
        "sobrecarga": sobrecarga,
        "quantum": quantum,
        "processos": {}
    };

    var num_processos = processosData.length;

    for (var i = 0; i < num_processos; i++) {
        var deadline = parseInt(document.getElementById(`deadline_time_${i}`).value);
        var chegada = parseInt(document.getElementById(`time_chegada_${i}`).value);
        var execucao = parseInt(document.getElementById(`execucao_tempo_${i}`).value);

        processosData[i].deadline = deadline;
        processosData[i].tempo_chegada = chegada;
        processosData[i].tempo_execucao = execucao;
    }

    
    for (var i = 0; i < processosData.length; i++) {
        // var label = String.fromCharCode(65 + i);
        result.processos[i] = {
            "grafico": {},
            "tempo_de_estouro_da_deadline": processosData[i].deadline,
            "tempo_de_chegada": processosData[i].tempo_chegada,
            "tempo_de_execucao": processosData[i].tempo_execucao
        };
    }

    var tempoRespostaMedio;
    
    escalonador = new Escalonador(quantum, sobrecarga)
    if (algoritmo === 'FIFO') {
        escalonador.calcularRespostaFIFO(result);
    } else if (algoritmo === 'SJF') {
        escalonador.calcularRespostaSJF();
    } else if (algoritmo === 'Round Robin') {
        escalonador.calcularRespostaRoundRobin();
    } else if (algoritmo === 'EDF') {
        escalonador.calcularRespostaEDF();
    }

    result.tempo_resposta_medio = tempoRespostaMedio;


    var jsonOutput = JSON.stringify(result, null, 2);
}