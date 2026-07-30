require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Importação das Rotas
const filmesRoutes = require('./routes/filmes');
const comprasRoutes = require('./routes/compras');
const assentosRoutes = require('./routes/assentos');

// Inicialização do Banco de Dados
require('./database/database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/filmes', filmesRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/assentos', assentosRoutes);
app.use('/api/comprovante', comprasRoutes); // Usaremos a rota de compras para retornar o comprovante também

// Fallback route para frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
