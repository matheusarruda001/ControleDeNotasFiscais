# Módulo de Controle de Nota Fiscal - Node.js

Sistema completo para gerenciamento de notas fiscais de produtos trocados pelo fabricante ou devolvidos sem troca, desenvolvido com Node.js, Express, MySQL e frontend em HTML/CSS/JavaScript.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **Multer** - Upload de arquivos
- **XLSX** - Manipulação de arquivos Excel
- **CORS** - Controle de acesso entre origens

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização e layout
- **JavaScript (ES6+)** - Lógica do frontend
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.0** - Ícones

## 📋 Funcionalidades

### ✅ Gerenciamento de Notas Fiscais
- Criar, editar, visualizar e excluir notas fiscais
- Campos: Data de abertura, código do produto, descrição, medida, status, número da troca, data de troca/devolução, NF de troca/devolução

### 📊 Dashboard e Estatísticas
- Cards com contadores em tempo real (Total, Trocados, Devolvidos)
- Atualização automática das estatísticas

### 🔍 Filtros e Pesquisa
- Filtro por status (Trocado/Devolvido)
- Pesquisa por código do produto
- Filtro por intervalo de datas
- Aplicação automática de filtros

### 📤 Importação de Dados
- Upload de arquivos Excel (.xlsx, .xls)
- Mapeamento automático de colunas
- Validação de dados durante a importação
- Relatório de erros e sucessos

### 🎨 Interface Responsiva
- Design moderno e intuitivo
- Compatível com desktop e mobile
- Animações e transições suaves
- Feedback visual para ações do usuário

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ instalado
- MySQL Server instalado e rodando
- npm ou yarn

### 1. Configuração do Banco de Dados

```bash
# Conectar ao MySQL como root
sudo mysql

# Criar banco de dados e usuário
CREATE DATABASE IF NOT EXISTS nota_fiscal_db;
CREATE USER IF NOT EXISTS 'nota_fiscal_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON nota_fiscal_db.* TO 'nota_fiscal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Instalação do Projeto

```bash
# Clonar ou extrair o projeto
cd nota_fiscal_nodejs

# Instalar dependências
npm install
```

### 3. Configuração do Ambiente

O arquivo `.env` já está configurado com as credenciais padrão:

```env
DB_HOST=localhost
DB_USER=nota_fiscal_user
DB_PASSWORD=password
DB_NAME=nota_fiscal_db
DB_PORT=3306
PORT=3000
```

### 4. Executar a Aplicação

```bash
# Modo de desenvolvimento
npm run dev

# Modo de produção
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
nota_fiscal_nodejs/
├── config/
│   └── database.js          # Configuração do Sequelize
├── models/
│   └── NotaFiscal.js        # Modelo de dados
├── routes/
│   └── notaFiscal.js        # Rotas da API
├── public/                  # Arquivos estáticos
│   ├── index.html           # Interface principal
│   ├── style.css            # Estilos personalizados
│   └── script.js            # Lógica JavaScript
├── uploads/                 # Diretório para arquivos temporários
├── .env                     # Variáveis de ambiente
├── app.js                   # Arquivo principal da aplicação
├── package.json             # Dependências e scripts
└── README.md               # Documentação
```

## 🔌 API Endpoints

### Notas Fiscais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/notas-fiscais` | Listar todas as notas fiscais |
| POST | `/api/notas-fiscais` | Criar nova nota fiscal |
| PUT | `/api/notas-fiscais/:id` | Atualizar nota fiscal |
| DELETE | `/api/notas-fiscais/:id` | Excluir nota fiscal |
| GET | `/api/notas-fiscais/stats` | Obter estatísticas |
| POST | `/api/notas-fiscais/import` | Importar arquivo Excel |

### Parâmetros de Filtro (GET)

- `status`: TROCADO ou DEVOLVIDO
- `codigo_produto`: Código do produto (busca parcial)
- `data_inicio`: Data de início (YYYY-MM-DD)
- `data_fim`: Data de fim (YYYY-MM-DD)

### Exemplo de Requisição

```javascript
// Criar nova nota fiscal
fetch('/api/notas-fiscais', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data_abertura: '26.10.24',
    codigo_produto: '4070959048',
    descricao: 'BASE ELETRICA',
    medida: '90X198X20',
    status: 'DEVOLVIDO',
    numero_troca: '809208',
    data_troca_devolucao: '07.02.25',
    nf_troca_devolucao: '811115'
  })
})
```

## 📊 Modelo de Dados

### Tabela: nota_fiscal

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único |
| data_abertura | DATE | Data de abertura |
| codigo_produto | VARCHAR(50) | Código do produto |
| descricao | VARCHAR(255) | Descrição do produto |
| medida | VARCHAR(50) | Medida/dimensão |
| status | ENUM | 'TROCADO' ou 'DEVOLVIDO' |
| numero_troca | VARCHAR(50) | Número da troca |
| data_troca_devolucao | DATE | Data da troca/devolução |
| nf_troca_devolucao | VARCHAR(50) | NF de troca/devolução |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

## 📤 Formato do Arquivo Excel

Para importação, o arquivo Excel deve conter as seguintes colunas:

| Coluna Excel | Campo no Sistema |
|--------------|------------------|
| DATA DA ABERTURA | data_abertura |
| CODIGO DO PRODUTO | codigo_produto |
| DESCRIÇÃO | descricao |
| MEDIDA | medida |
| TROCADO OU DEVOLVIDO | status |
| n° da TROCA | numero_troca |
| DATA DA TROCA/DEVOLUÇÃO | data_troca_devolucao |
| NF DA TROCA/NF DA DEVOLUÇÃO | nf_troca_devolucao |

**Formato de Data:** dd.mm.aa (exemplo: 26.10.24)

## 🎯 Como Usar

### 1. Importação Inicial
1. Clique em "Importar Excel"
2. Selecione seu arquivo Excel
3. Clique em "Importar"
4. Verifique os resultados

### 2. Criação Manual
1. Clique em "Nova Nota Fiscal"
2. Preencha os campos obrigatórios (*)
3. Clique em "Salvar"

### 3. Filtros e Pesquisa
1. Use os filtros na seção "Filtros e Ações"
2. Os resultados são atualizados automaticamente
3. Use o botão "Limpar" para remover filtros

### 4. Edição e Exclusão
1. Use os botões na coluna "Ações" da tabela
2. Ícone de lápis para editar
3. Ícone de lixeira para excluir (com confirmação)

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm start      # Executar em produção
npm run dev    # Executar em desenvolvimento
npm test       # Executar testes (não implementado)
```

### Estrutura da API

A API segue o padrão RESTful com respostas em JSON:

```javascript
// Resposta de sucesso
{
  "success": true,
  "data": [...],
  "message": "Operação realizada com sucesso"
}

// Resposta de erro
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## 🚀 Deploy

### Opções de Deploy

1. **Servidor VPS/Dedicado**
   - Configure MySQL
   - Clone o projeto
   - Configure variáveis de ambiente
   - Use PM2 para gerenciar o processo

2. **Heroku**
   - Configure ClearDB MySQL addon
   - Configure variáveis de ambiente
   - Deploy via Git

3. **DigitalOcean App Platform**
   - Configure banco MySQL gerenciado
   - Configure variáveis de ambiente
   - Deploy via GitHub

### Variáveis de Ambiente para Produção

```env
DB_HOST=seu_host_mysql
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nota_fiscal_db
DB_PORT=3306
PORT=3000
NODE_ENV=production
```

## 🔒 Segurança

- Validação de entrada em todos os endpoints
- Sanitização de dados SQL via Sequelize ORM
- Controle de CORS configurado
- Tratamento de erros sem exposição de dados sensíveis

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de conexão com MySQL:**
```bash
# Verificar se o MySQL está rodando
sudo systemctl status mysql

# Iniciar MySQL se necessário
sudo systemctl start mysql
```

**Erro de dependências:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Erro de permissões no banco:**
```sql
-- Verificar permissões do usuário
SHOW GRANTS FOR 'nota_fiscal_user'@'localhost';
```

## 📝 Changelog

### v1.0.0
- ✅ Sistema completo de CRUD para notas fiscais
- ✅ Interface web responsiva
- ✅ Importação de arquivos Excel
- ✅ Filtros e pesquisa avançada
- ✅ Dashboard com estatísticas
- ✅ API RESTful completa

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## 📞 Suporte

Para suporte técnico:
- Verifique os logs da aplicação
- Consulte a documentação da API
- Verifique as configurações do banco de dados

---

**Desenvolvido com ❤️ usando Node.js e MySQL**

