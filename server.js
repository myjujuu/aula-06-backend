const express = require('express');
const app = express();

app.use(express.json());

let animais = [
  { id: 1, nome: "Thor", especie: "Canino", raca: "Golden Retriever", idade: 3, vacinas: [] }
];
let proximoId = 2;

// 1. Listar todos os animais
app.get('/animais', (req, res) => {
  res.json(animais);
});

// 2. Buscar animal por ID
app.get('/animais/:id', (req, res) => {
  const animal = animais.find(a => a.id == req.params.id);
  if (!animal) return res.status(404).json({ mensagem: "Animal não encontrado." });
  
  res.json(animal);
});

// 3. Cadastrar novo animal
app.post('/animais', (req, res) => {
  const { nome, especie, raca, idade } = req.body;
  
  if (!nome || !especie || !raca || idade === undefined) {
    return res.status(400).json({ mensagem: "Preencha todos os campos." });
  }

  const novoAnimal = { id: proximoId++, nome, especie, raca, idade: Number(idade), vacinas: [] };
  animais.push(novoAnimal);
  res.status(201).json(novoAnimal);
});

// 4. Atualizar animal existente
app.put('/animais/:id', (req, res) => {
  const animal = animais.find(a => a.id == req.params.id);
  if (!animal) return res.status(404).json({ mensagem: "Animal não encontrado." });

  const { nome, especie, raca, idade } = req.body;
  if (nome) animal.nome = nome;
  if (especie) animal.especie = especie;
  if (raca) animal.raca = raca;
  if (idade !== undefined) animal.idade = Number(idade);

  res.json(animal);
});

// 5. Remover animal
app.delete('/animais/:id', (req, res) => {
  const index = animais.findIndex(a => a.id == req.params.id);
  if (index === -1) return res.status(404).json({ mensagem: "Animal não encontrado." });

  const [removido] = animais.splice(index, 1);
  res.json({ mensagem: "Animal removido.", animal: removido });
});

// 6. Desafio: Aplicar vacina no animal
app.post('/animais/:id/vacinas', (req, res) => {
  const animal = animais.find(a => a.id == req.params.id);
  if (!animal) return res.status(404).json({ mensagem: "Animal não encontrado." });

  const { nomeImunizante, dataProximaDose } = req.body;
  if (!nomeImunizante || !dataProximaDose) {
    return res.status(400).json({ mensagem: "Informe nomeImunizante e dataProximaDose." });
  }

  const novaVacina = { nomeImunizante, dataProximaDose };
  animal.vacinas.push(novaVacina);

  res.status(201).json({ mensagem: "Vacina registrada.", animal });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));