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
            "deadline": 0, // Inicializa com 0, o usuário irá inserir depois
            "tempo_chegada": 0, // Inicializa com 0, o usuário irá inserir depois
            "tempo_execucao": 0 // Inicializa com 0, o usuário irá inserir depois
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
    document.getElementById('jsonOutput').innerHTML = '';
}

function criarJSON() {
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
        var label = String.fromCharCode(65 + i); // A, B, C, ...
        result.processos[label] = {
            "grafico": {},
            "tempo_de_estouro_da_deadline": processosData[i].deadline,
            "tempo_de_chegada": processosData[i].tempo_chegada,
            "tempo_de_execucao": processosData[i].tempo_execucao,
            "quantum": processosData[i].quantum,
            "sobrecarga": processosData[i].sobrecarga
        };
    }

    var jsonOutput = JSON.stringify(result, null, 2);

    document.getElementById('jsonOutput').innerText = jsonOutput;
}