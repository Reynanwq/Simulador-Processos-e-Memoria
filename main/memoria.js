class Memoria {

    constructor() {
        this.tamanhoRAM = 200
        this.tamanhoPaginaReal = 4
        this.numeroPaginasReais = this.tamanhoRAM / this.tamanhoPaginaReal
        
        this.maximodePaginasPorProcesso = 10
        this.maximoDeProcessosNaRam = this.numeroPaginasReais / this.maximodePaginasPorProcesso 

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
                counter++
            }

            disco.appendChild(fila);
        }
    }

    fifo() {
        
    }

}