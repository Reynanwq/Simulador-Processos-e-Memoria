/*Este código implementa uma janela de visualização de memória real em um ambiente web. A classe `RealMemoryWindow` cria uma janela com quatro listas verticais, representando diferentes aspectos da memória real, como endereço real, Process ID, endereço virtual e último acesso. A janela inclui uma barra de rolagem vertical que sincroniza o deslocamento das listas. O código também adiciona essa janela ao corpo do documento HTML quando a página é carregada, criando uma instância da classe `RealMemoryWindow.*/
class RealMemoryWindow {
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

        this.listBox1 = this.createListBox("Endereço Real:");
        this.listBox2 = this.createListBox("Process ID:");
        this.listBox3 = this.createListBox("Endereço Virtual:");
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

        container.appendChild(this.window);
    }

    onMoveListBox() {
        this.listBox1.scrollTop = this.scrollbar.scrollTop;
        this.listBox2.scrollTop = this.scrollbar.scrollTop;
        this.listBox3.scrollTop = this.scrollbar.scrollTop;
        this.listBox4.scrollTop = this.scrollbar.scrollTop;
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

    onWheel(event) {
        this.listBox1.scrollBy(0, event.deltaY);
        this.listBox2.scrollBy(0, event.deltaY);
        this.listBox3.scrollBy(0, event.deltaY);
        this.listBox4.scrollBy(0, event.deltaY);
        event.preventDefault();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.body;
    const realMemoryWindow = new RealMemoryWindow(container, 'Real Memory Window');
});