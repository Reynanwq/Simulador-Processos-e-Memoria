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

        var label = String.fromCharCode(65 + i);
        processosDetailsHTML += `
            <div class="row">
                <div class="col">
                    <h3>Processo ${label}</h3>
                </div>
                <div class="col">
                    <label for="deadline_time_${i}">Deadline:</label>
                    <input type="number" id="deadline_time_${i}", value="${10 + i}" class="form-control">
                </div>
                <div class="col">
                    <label for="time_chegada_${i}">Tempo de chegada:</label>
                    <input type="number" id="time_chegada_${i}", value="0" class="form-control">
                </div>
                <div class="col">
                    <label for="execucao_tempo_${i}">Tempo de execução:</label>
                    <input type="number" id="execucao_tempo_${i}", value="10" class="form-control">
                </div>
                <div class="col">
                    <label for="numero_paginas_${i}">N° de Páginas:</label>
                    <input type="number" id="numero_paginas_${i}", value="10" class="form-control">
                </div>
            </div>
        `;
    }

    document.getElementById('processosDetails').innerHTML = processosDetailsHTML;

    document.getElementById('num_processos').disabled = true;
    document.getElementById('qtd_quantum').disabled = true;
    document.getElementById('sobrecarga').disabled = true;

    document.getElementById('processos').style.display = 'block';
}



async function executar(algoritmo) {
    var quantum = parseInt(document.getElementById('qtd_quantum').value);
    var sobrecarga = parseInt(document.getElementById('sobrecarga').value);
    var data = {
        "sobrecarga": sobrecarga,
        "quantum": quantum,
        "processos": [],
        "grafico": []
    };

    var num_processos = processosData.length;

    for (var i = 0; i < num_processos; i++) {
        var deadline = parseInt(document.getElementById(`deadline_time_${i}`).value);
        var chegada = parseInt(document.getElementById(`time_chegada_${i}`).value);
        var execucao = parseInt(document.getElementById(`execucao_tempo_${i}`).value);
        var paginas = parseInt(document.getElementById(`numero_paginas_${i}`).value);

        processosData[i].deadline = deadline;
        processosData[i].tempo_chegada = chegada;
        processosData[i].tempo_execucao = execucao;
        processosData[i].paginas = paginas
    }


    for (var i = 0; i < num_processos; i++) {
        var label = String.fromCharCode(65 + i);
        var atributos = {
            "label": label,
            "tempo_de_chegada": processosData[i].tempo_chegada,
            "tempo_de_execucao": processosData[i].tempo_execucao,
            "paginas": processosData[i].paginas
        }
        if (algoritmo === 'EDF') {
            atributos["deadline"] = processosData[i].deadline
        }

        data.processos.push(atributos)
    }

    let resultado = data
    escalonador = new Escalonador(data)

    if (algoritmo === 'FIFO') {
        resultado = await escalonador.fifo(data.processos);
    } else if (algoritmo === 'SJF') {
        resultado = escalonador.sjf();
    } else if (algoritmo === 'Round Robin') {
        resultado = escalonador.roundrobin();
    } else if (algoritmo === 'EDF') {
        resultado = escalonador.edf();
    }

    // console.log(JSON.stringify(resultado))


    let tempo_medio = resultado.tempo_medio.toFixed(2);
    document.getElementById('tempo-medio').innerHTML = `<h3>Turnaround médio (${algoritmo}) = ${tempo_medio}</h3>`;


    var algoritmoTrocaPaginas = document.getElementById('algoritmo_troca').value;


    let memoria = new Memoria(resultado.processos)

    try {
        memoria.criarMemoriaRam()
        document.getElementById('nome-algoritmo').innerHTML = `Troca de páginas: ${algoritmoTrocaPaginas}`
        // memoria.criarDisco()
        // await memoria.adicionarPaginasNoDisco(resultado.processos)
    } catch (error) {
        console.log('Erro na criação das memórias')
    }

    Grafico.gerarLabels(algoritmo)
    await Grafico.gerarGrafico(resultado, algoritmoTrocaPaginas, memoria)
}