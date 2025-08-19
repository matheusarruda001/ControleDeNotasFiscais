const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const NotaFiscal = require('./models/NotaFiscal');
const Produto = require('./models/Produto');
const notaFiscalRoutes = require('./routes/notaFiscal');
const produtoRoutes = require('./routes/produto');
const baixarConsignadoRoutes = require('./routes/baixarConsignado');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.use('/api/notas-fiscais', notaFiscalRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/baixar-consignado', baixarConsignadoRoutes);

// Rota principal - servir o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Inicializar banco de dados e servidor
async function startServer() {
  try {
    // Testar conexão com o banco
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar modelos com o banco
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados com o banco de dados.');
    
    // Iniciar servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesse: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o servidor:', error);
    process.exit(1);
  }
}

startServer();

