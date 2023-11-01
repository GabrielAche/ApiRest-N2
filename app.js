const express = require('express');
const app = express();
const port = 3000;

// Arrays para armazenar materiais e quantidades
let materiais = [];
let quantidades = [];

// Middleware para tratar o corpo da solicitação como JSON
app.use(express.json());

// Requisito 1 - Listar materiais
app.get('/materials', (req, res) => {
  // Montar um arquivo JSON com os materiais
  let estoque = materiais.map((material, index) => ({
    id: index,
    nome: material,
    quantidade: quantidades[index],
  }));

  // Enviar a resposta
  res.status(200).json(estoque);
});

// Requisito 2 - Criação
app.post('/materials', (req, res) => {
  // Obter os dados do corpo da solicitação
  let { nome, quantidade } = req.body.material;

  // Adicionar os dados aos arrays
  materiais.push(nome);
  quantidades.push(quantidade);

  // Enviar resposta de criação
  res.status(201).send('O material foi criado.');
});

// Requisito 3 - Busca por ID
app.get('/materials/:id', (req, res) => {
  let id = req.params.id;

  // Verificar se o ID é válido
  if (id < 0 || id >= materiais.length) {
    return res.status(404).send('O material não foi localizado');
  }

  // Montar um arquivo JSON com os dados do material
  let materialData = {
    id,
    nome: materiais[id],
    quantidade: quantidades[id],
  };

  // Enviar a resposta
  res.status(200).json(materialData);
});

// Requisito 4 - Alterar por ID
app.put('/materials/:id', (req, res) => {
  let id = req.params.id;

  // Verificar se o ID é válido
  if (id < 0 || id >= materiais.length) {
    return res.status(404).send('O material não foi localizaado');
  }

  // Obter os novos dados do corpo da solicitação
  let { name, qtde } = req.body.material;

  // Atualizar os dados no array
  materiais[id] = name;
  quantidades[id] = qtde;

  // Enviar resposta de sucesso
  res.status(200).send('Material atualizado com sucesso');
});

// Requisito 5 - Remover por ID
app.delete('/materials/:id', (req, res) => {
  let id = req.params.id;

  // Verificar se o ID é válido
  if (id < 0 || id >= materiais.length) {
    return res.status(404).send('Material não encontrado');
  }

  // Remover o material e a quantidade
  materiais.splice(id, 1);
  quantidades.splice(id, 1);

  // Atualizar os IDs nos materiais restantes
  materiais.forEach((material, index) => {
    materiais[index] = material;
    quantidades[index] = quantidades[index];
  });

  // Montar um arquivo JSON com os materiais restantes
  let materialsList = materiais.map((material, index) => ({
    id: index,
    nome: material,
    quantidade: quantidades[index],
  }));

  // Enviar a resposta com a lista atualizada
  res.status(200).json(materialsList);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}`);
});

