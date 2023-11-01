const express = require('express'); // módulo do express pra criar o servidor web
const app = express(); // crio a instância
const PORT = process.env.PORT || 3000; // função para definir a porta do servidor
app.listen(PORT, () => { // inicia o servidor na porta definida
    console.log(`Porta ${PORT} do servidor`); //mostra a mensagem da porta
});

const data = {}; // A lista com os materiais e quantidades

app.use(express.json()); // usar o formato json

// Requisito 1 - Listar materiais - GET geral
app.get('/materials', (req, res) => {
    const estoque = Object.entries(data).map(([id, material]) => ({ // O object.entries(data)transforma o objeto (data) em matriz, com 2 valores (nome e quantidade). Já o .map faz a leitura da minha matriz e retorna o id
        id,
        nome: material.nome,
        quantidade: material.quantidade,
    }));

    res.status(200).json(estoque);
});

// Requisito 2 - Criação - POST 
app.post('/materials', (req, res) => {
    const { nome, quantidade } = req.body; // pega os dados pra request
    if (!nome || !quantidade) { // faz verificaçào dos dados 
        res.status(400).json({ error: 'Dados inválidos' });
        return;
    }

    const id = Date.now().toString(); //gera o id
    data[id] = { nome, quantidade }; // vai guardar os dados no data
    res.status(201).send();
});

// Requisito 3 - GET por ID 
app.get('/materials/:id', (req, res) => {
    const { id } = req.params; //defino os parametros da request
    const material = data[id]; // ve se existe o material
    if (material) {
        res.status(200).json({ material: { id, nome: material.nome, quantidade: material.quantidade } });
    } else {
        res.status(404).json({ error: 'O Material não localizado' });
    }
});

// Requisito 4 - Alterar por ID - PUT
app.put('/materials/:id', (req, res) => {
    const { id } = req.params; // requisitos da request
    const { nome, quantidade } = req.body;
    if (data[id] && nome && quantidade) { // verifica se existe o data
        data[id] = { nome, quantidade }; //altera pelo id
        res.status(200).send();
    } else {
        res.status(404).json({ error: ' O Material não localizado ou não existe' });
    }
});

// Requisito 5 - Remover por ID - DELETE
app.delete('/materials/:id', (req, res) => {
    const { id } = req.params;
    if (data[id]) { //se existe o objeto no data, é excluído
        delete data[id];
        res.status(200).json(Object.entries(data).map(([id, material]) => ({
            id,
            nome: material.nome,
            quantidade: material.quantidade,
        })));
    } else {
        res.status(404).json({ error: 'Material não foi localizado' });
    }
});


