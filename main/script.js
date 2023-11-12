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
                    <input type="number" id="deadline_time_${i}", value="${i}" class="form-control">
                </div>
                <div class="col">
                    <label for="time_chegada_${i}">Tempo de chegada:</label>
                    <input type="number" id="time_chegada_${i}", value="0" class="form-control">
                </div>
                <div class="col">
                    <label for="execucao_tempo_${i}">Tempo de execução:</label>
                    <input type="number" id="execucao_tempo_${i}", value="10" class="form-control">
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
        "grafico" : []
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

    
    for (var i = 0; i < num_processos; i++) {
        var label = String.fromCharCode(65 + i);
        var atributos = {
            "label": label,
            "tempo_de_chegada": processosData[i].tempo_chegada,
            "tempo_de_execucao": processosData[i].tempo_execucao
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

    console.log(JSON.stringify(resultado))

    let tempo_medio = resultado.tempo_medio.toFixed(2);;
    document.getElementById('tempo-medio').innerHTML = `<h3>Tempo médio ${algoritmo} = ${tempo_medio}</h3>`;

    let grafico = resultado.grafico
    let labels = []
    for (const acao of grafico) {
        labels.push(acao['label'])
    }
    labels = [...new Set(labels)];

    let larguraDaUltimaExecucao = {} // Contará quantas vezes um processo executou continuamente
    let chartContainer = document.getElementById('chartContainer');
    chartContainer.innerHTML = "";
    for (let label of labels) {
        larguraDaUltimaExecucao[label] = 0
        let divProcesso = document.createElement('div')
        divProcesso.classList.add('process-bar')

        let processLabel = document.createElement('div');
        processLabel.classList.add('process-label');
        processLabel.innerText = label;
        processLabel.id = label + "label"

        let containerAcoes = document.createElement('div')
        containerAcoes.classList.add('bar-container')
        containerAcoes.id = label

        divProcesso.appendChild(processLabel)
        divProcesso.appendChild(containerAcoes)
        chartContainer.appendChild(divProcesso)
    }
    

    let ultimoProcesso = null
    let largura = 0
    for (const [i, acao] of grafico.entries()) {
        let containerAcoes = document.getElementById(acao['label'])
        const bar = document.createElement('div');
        bar.classList.add('bar');

        if (acao['status'] === 'executando') {
            bar.classList.add('executing');
        } else if (acao['status'] === 'sobrecarga') {
            bar.classList.add('overload');
        }
        
        if (acao['tempo'] >= acao['tempo_estouro_deadline']) {
            bar.innerHTML = `<span style="display: inline-block; text-align: center; width: 100%;">${acao['tempo'] + ' X'}</span>`;
        } else {
            bar.innerHTML = `<span style="display: inline-block; text-align: center; width: 100%;">${acao['tempo']}</span>`;
        }
        
        
        bar.style.width = '40px';
        containerAcoes.appendChild(bar);

        largura = largura + 30

        if (acao['label'] != ultimoProcesso) {
            largura = largura - larguraDaUltimaExecucao[acao['label']]

            if (larguraDaUltimaExecucao[acao['label']] > 0) {
                larguraDaUltimaExecucao[acao['label']] = 0
            }
            bar.style.marginLeft = largura - 30 + 'px'
        }
        
        ultimoProcesso = acao['label']
        larguraDaUltimaExecucao[acao['label']] = larguraDaUltimaExecucao[acao['label']] + 30
    }

}