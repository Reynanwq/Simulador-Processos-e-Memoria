// Definindo um objeto para simular um contexto
const myContext = {
    hasChanged: {
      color: null,
      currentExecution: null,
    },
    trackLRU: [],
  };
  
  // Função para atualizar o contexto
  function updateContext(newData) {
    Object.assign(myContext, newData);
  }
  
  // Função para acessar o contexto
  function useContext() {
    return myContext;
  }
  
  let trackLRU = [];
  
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
  ];
  
  function currentUsage(pages) {
    return pages.reduce((acc, page) => {
      return acc + page.size;
    }, 0);
  }
  
  function renderTable(size, pages, tableId) {
    let cells = [];
  
    pages.forEach((page) => {
      for (let i = 0; i < page.size; i++) {
        cells.push(`<div class="cell"><span>${i + 1}</span></div></div>`);
      }
    });
  
    for (let i = cells.length; i < size; i++) {
      cells.push(`<div class="cell"><span>${i + 1}</span></div>`);
    }
  
    document.getElementById(tableId).innerHTML = cells.join('');
  }
  
  const initialState = {
    size: 50,
    pages: [],
  };
  
  const ramState = { ...initialState };
  const discoState = { ...initialState };
  
  // Mocking the data for demonstration, replace this with your actual data
  const data = {
    algoritmoMemoria: "FIFO",
    processData: [
      { pages: 4, state: "executando" },
      { pages: 2, state: "espera" },
      { pages: 3, state: "executando" },
    ],
  };
  
  const algoritmo = data.algoritmoMemoria;
  
  const pages = data.processData.map((process, index) => {
    if (process.state !== "a caminho") {
      return {
        size: process.pages,
        color: colors[index],
        state: process.state,
      };
    } else {
      return {
        size: 0,
        color: colors[index],
        state: process.state,
      };
    }
  });
  
  const currentExecution = pages.find((page) => page.state === "executando");
  
  function handleMemoryUpdate() {
    if (algoritmo === "FIFO") {
      if (currentExecution) {
        if (myContext.hasChanged.color !== currentExecution.color) {
          if (
            ramState.pages.find(
              (page) => page.color === currentExecution.color
            ) !== undefined
          ) {
            return;
          }
  
          if (
            currentUsage(ramState.pages) + currentExecution.size >
            ramState.size
          ) {
            const pagesRemovedPages = ramState.pages.slice(1);
            updateContext({
              ramState: { ...ramState, pages: [...pagesRemovedPages, currentExecution] },
            });
          } else {
            updateContext({
              ramState: { ...ramState, pages: [...ramState.pages, currentExecution] },
            });
          }
  
          renderTable(51, ramState.pages, 'ramTable');
          myContext.hasChanged.currentExecution = currentExecution;
        }
      }
    }
  
    if (algoritmo === "LRU") {
      if (currentExecution) {
        if (myContext.hasChanged.color !== currentExecution.color) {
          if (
            ramState.pages.find(
              (page) => page.color === currentExecution.color
            ) !== undefined
          ) {
            return;
          }
  
          if (
            trackLRU.find(
              (page) => page.color === currentExecution.color
            ) === undefined
          ) {
            updateContext({ trackLRU: [currentExecution, ...trackLRU] });
          } else {
            const index = trackLRU.findIndex(
              (page) => page.color === currentExecution.color
            );
            const page = trackLRU[index];
            updateContext((prevContext) => {
              const updatedTrackLRU = [...prevContext.trackLRU];
              updatedTrackLRU.splice(index, 1);
              return { ...prevContext, trackLRU: [page, ...updatedTrackLRU] };
            });
          }
  
          if (
            currentUsage(ramState.pages) + currentExecution.size >
            ramState.size
          ) {
            const pageToRemove = trackLRU[trackLRU.length - 1];
            const pagesRemovedPages = ramState.pages.filter(
              (page) => page.color !== pageToRemove?.color
            );
            updateContext({
              ramState: { ...ramState, pages: pagesRemovedPages },
            });
          } else {
            updateContext({
              ramState: { ...ramState, pages: [...ramState.pages, currentExecution] },
            });
          }
  
          renderTable(51, ramState.pages, 'ramTable');
          myContext.hasChanged.currentExecution = currentExecution;
        }
      }
    }
  
    renderTable(120, pages, 'discoTable');
    updateContext({ hasChanged: myContext.hasChanged, trackLRU });
    myContext.hasChanged.currentExecution = currentExecution;
  }
  
    document.getElementById('adicionarProcessosBtn').addEventListener('click', function () {
    var numProcessos = document.getElementById('num_processos').value;
    var qtdPaginas = document.getElementById('qtd_paginas').value;
  
    adicionarProcessos(numProcessos, qtdPaginas);
  
    renderTable(51, ramState.pages, 'ramTable');
    renderTable(120, pages, 'discoTable');
    handleMemoryUpdate();
  });
  
  renderTable(51, ramState.pages, 'ramTable');
  renderTable(120, pages, 'discoTable');
  handleMemoryUpdate();
  