const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

const logReq = (req, res, next) => {
  const horaAtual = new Date().toISOString();
  console.log(
    `[${horaAtual}] Nova solicitação recebida: ${req.method} ${req.originalUrl}`
  );
  next();
};

app.use(logReq);

const validaId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido." });
  }

  next();
};

let produtos = [];

app.post("/produtos", (req, res) => {
  const { nome, preco, descricao } = req.body;

  if (!nome || !preco) {
    return res.status(400).json({ erro: "Nome e preço são obrigatórios." });
  }

  if (typeof nome !== "string" || typeof preco !== "number" || typeof descricao !== "string") {
    return res.status(400).json({
        erro: "Nome e descrição precisam ser strings. Preço precisa ser um número.",
      });
  }

  const produto = {
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    nome,
    preco,
    descricao,
  };

  produtos.push(produto);
  res.json({ mensagem: "Produto criado com sucesso!", produto });
});

app.get("/produtos", (req, res) => {
  if (produtos.length === 0) {
    return res.status(400).json({
      erro: "Não existe nenhum produto cadastrado."
     });
  }
  res.json(produtos);
});

app.put("/produtos/:id", validaId, (req, res) => {
  const { id } = req.params;
  const { nome, preco, descricao } = req.body;

  const produtoIndex = produtos.findIndex(
    (produto) => produto.id === Number.parseInt(id)
  );

  if (produtoIndex === -1) {
    res.status(404).json({ erro: "Produto não encontrado." });
    return;
  }

  if (!nome || !preco) { return res.status(400).json({ 
      erro: "Nome, preco e descrição são obrigatórios."
    });
  }

  produtos[produtoIndex].nome = nome;
  produtos[produtoIndex].preco = preco;
  produtos[produtoIndex].descricao = descricao;

  res.json({
    mensagem: "Produto atualizado com sucesso!",
    produto: produtos[produtoIndex],
  });
});

app.delete("/produtos/:id", validaId, (req, res) => {
  const { id } = req.params;

  const index = produtos.findIndex((p) => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ erro: "Produto não encontrado." });
  }

  produtos.splice(index, 1);
  res.json({ mensagem: "Produto removido com sucesso!"});
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
