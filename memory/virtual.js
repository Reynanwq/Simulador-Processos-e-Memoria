/*implementa uma janela de visualização da memória virtual em um ambiente web. A classe VirtualMemoryWindow cria uma interface com quatro listas verticais, representando informações sobre processos na memória virtual, como Process ID, Memória Virtual, Endereço Real e Último Acesso. A janela inclui uma barra de rolagem vertical que sincroniza o deslocamento das listas. Além disso, há um campo de entrada que permite filtrar os processos exibidos na tabela com base no ID do processo. O código adiciona essa janela ao corpo do documento HTML quando a página é carregada, criando uma instância da classe VirtualMemoryWindow.*/
class VirtualMemoryWindow {
    constructor(container, title = "Window", size = [600, 600]) {
        this.size = size;
        this.memoryManager = null;

        this.window = document.createElement("div");
        this.window.style.width = `${size[0]}px`;
        this.window.style.height = `${size[1]}px`;
        this.window.style.backgroundColor = "white";
        this.window.style.overflow = "hidden";

        this.mainFrame = document.createElement("div");
        this.mainFrame.style.width = "100%";
        this.mainFrame.style.height = "100%";
        this.mainFrame.style.display = "flex";
        this.mainFrame.style.flexDirection = "column";
        this.window.appendChild(this.mainFrame);

        this.listBox1 = this.createListBox("Process ID:");
        this.listBox2 = this.createListBox("Memória Virtual:");
        this.listBox3 = this.createListBox("Endereço Real:");
        this.listBox4 = this.createListBox("Último Acesso:");

        this.scrollbar = document.createElement("div");
        this.scrollbar.style.width = "10px";
        this.scrollbar.style.backgroundColor = "lightgray";
        this.scrollbar.style.cursor = "pointer";
        this.scrollbar.style.marginLeft = "auto";
        this.scrollbar.style.overflowY = "scroll";
        this.scrollbar.style.scrollbarWidth = "thin";
        this.scrollbar.style.msOverflowStyle = "none";
        this.scrollbar.addEventListener("scroll", this.onMoveListBox.bind(this));
        this.mainFrame.appendChild(this.scrollbar);

        this.inputFrame = document.createElement("div");
        this.inputFrame.style.backgroundColor = "white";
        this.inputFrame.style.padding = "10px";
        this.inputFrame.style.display = "flex";
        this.inputFrame.style.justifyContent = "space-between";
        this.mainFrame.appendChild(this.inputFrame);

        this.label = document.createElement("label");
        this.label.textContent = "Search by inserting a process ID:";
        this.label.style.fontFamily = "Arial";
        this.label.style.fontSize = `${size[1] * 0.02}px`;
        this.label.style.backgroundColor = "white";
        this.label.style.marginRight = "10px";
        this.inputFrame.appendChild(this.label);

        this.entry = document.createElement("input");
        this.entry.type = "text";
        this.entry.style.width = "30px";
        this.entry.style.backgroundColor = "white";
        this.entry.addEventListener("input", this.validateEntry.bind(this));
        this.inputFrame.appendChild(this.entry);

        container.appendChild(this.window);
    }

    onMoveListBox() {
        this.listBox1.scrollTop = this.scrollbar.scrollTop;
        this.listBox2.scrollTop = this.scrollbar.scrollTop;
        this.listBox3.scrollTop = this.scrollbar.scrollTop;
        this.listBox4.scrollTop = this.scrollbar.scrollTop;
    }

    onWheel(event) {
        this.listBox1.scrollBy(0, event.deltaY);
        this.listBox2.scrollBy(0, event.deltaY);
        this.listBox3.scrollBy(0, event.deltaY);
        this.listBox4.scrollBy(0, event.deltaY);
        event.preventDefault();
    }

    validateEntry() {
        const string = this.entry.value;
        for (const char of string) {
            if (!"0123456789".includes(char)) {
                return;
            }
        }
        this.updateTable(string);
    }

    createListBox(labelText) {
        const listBox = document.createElement("div");
        listBox.style.width = "20%";
        listBox.style.backgroundColor = "white";
        listBox.style.overflowY = "scroll";
        listBox.style.border = "1px solid black";
        listBox.style.marginRight = "10px";
        listBox.addEventListener("wheel", this.onWheel.bind(this));
        this.mainFrame.appendChild(listBox);

        const label = document.createElement("div");
        label.textContent = labelText;
        listBox.appendChild(label);

        return listBox;
    }

    updateTable(filterByProcessId = "") {
        if (!filterByProcessId) {
            filterByProcessId = this.entry.value;
        }

        this.listBox1.innerHTML = "<div>Process ID:</div>";
        this.listBox2.innerHTML = "<div>Memória Virtual:</div>";
        this.listBox3.innerHTML = "<div>Endereço Real:</div>";
        this.listBox4.innerHTML = "<div>Último Acesso:</div>";

        const data = Array(this.memoryManager.ramMemoryPages).fill(["", "", ""]);

        for (const [processId, virtualAddress, realAddress, lastUsedAt] of this.memoryManager.getVirtualMemoryTable()) {
            if (realAddress !== null) {
                data[realAddress] = [String(processId), String(virtualAddress), lastUsedAt];
            }
        }

        for (const [processId, virtualAddress, lastUsedAt] of data) {
            this.listBox1.innerHTML += `<div>${processId}</div>`;
            this.listBox2.innerHTML += `<div>${virtualAddress}</div>`;
            this.listBox3.innerHTML += `<div>${realAddress !== null ? realAddress : ""}</div>`;
            this.listBox4.innerHTML += `<div>${lastUsedAt !== null ? lastUsedAt : ""}</div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.body;
    const virtualMemoryWindow = new VirtualMemoryWindow(container, 'Virtual Memory Window');
});