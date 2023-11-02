const express = require('express');
const app = express();
const path = require('path');

const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/criarArquivoJSON/:algoritmo', (req, res) => {
    const algoritmo = req.params.algoritmo;
    const jsonOutput = JSON.stringify(req.body, null, 2);
    const filePath = `./${algoritmo}_output.json`;

    fs.writeFile(filePath, jsonOutput, (err) => {
        if (err) {
            res.status(500).send('Erro ao criar o arquivo JSON');
        } else {
            res.send(`Arquivo ${algoritmo}_output.json criado.`);
        }
    });
});

const port = 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));