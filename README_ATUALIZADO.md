# Módulo de Controle de Nota Fiscal - Node.js (Versão Atualizada)

Sistema completo para gerenciamento de notas fiscais de produtos trocados pelo fabricante ou devolvidos sem troca, desenvolvido com Node.js, Express, MySQL e frontend em HTML/CSS/JavaScript.

## 🆕 Novas Funcionalidades Implementadas

### ✅ **Geração de Relatório Excel**
- Botão "Gerar Relatório Excel" que exporta todos os dados em formato .xlsx
- Inclui filtros aplicados na exportação
- Arquivo nomeado automaticamente com data atual
- Formatação profissional com cabeçalhos estilizados

### ✅ **Formato de Data Atualizado**
- Datas agora no formato **dd/mm/aaaa** (antes era dd.mm.aa)
- Campos de data com placeholder "dd/mm/aaaa"
- Conversão automática entre formatos de exibição e banco de dados

### ✅ **Dois Tipos de Cadastro**
- **Cadastrar Nota Fiscal de Troca**: Para produtos trocados pelo fabricante
- **Cadastrar Nota Fiscal de Ocorrência**: Para produtos devolvidos sem troca
- Campos condicionais: "Número da Troca" ou "Número da Ocorrência"
- Badges visuais para identificar o tipo (Troca = azul, Ocorrência = amarelo)

### ✅ **Importação de Tabela de Produtos**
- Novo botão "Importar Produtos" para carregar catálogo de produtos
- Suporte a arquivos Excel (.xlsx, .xls)
- Colunas esperadas: CODIGO, DESCRICAO, MEDIDA
- Atualização automática de produtos existentes

### ✅ **Autocompletar de Produtos**
- Busca automática por código do produto durante digitação
- Busca também por descrição do produto
- Preenchimento automático de descrição e medida
- Dropdown com sugestões em tempo real

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **ExcelJS** - Geração de arquivos Excel
- **Multer** - Upload de arquivos
- **XLSX** - Manipulação de arquivos Excel
- **CORS** - Controle de acesso entre origens

### Frontend
- **HTML5** - Estrutura da página
- **CSS3** - Estilização e layout
- **JavaScript (ES6+)** - Lógica do frontend
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome 6.0** - Ícones

## 📋 Funcionalidades Completas

### 🗂️ **Gerenciamento de Notas Fiscais**
- Criar, editar, visualizar e excluir notas fiscais
- Dois tipos: **Troca** e **Ocorrência**
- Campos: Data de abertura, código do produto, descrição, medida, tipo, status, número da troca/ocorrência, data de troca/devolução, NF de troca/devolução

### 📊 **Dashboard e Estatísticas**
- Cards com contadores em tempo real (Total, Trocados, Devolvidos)
- Atualização automática das estatísticas

### 🔍 **Filtros e Pesquisa**
- Filtro por status (Trocado/Devolvido)
- Pesquisa por código do produto
- Filtro por intervalo de datas
- Aplicação automática de filtros

### 📤 **Importação e Exportação**
- **Importar Excel**: Upload de notas fiscais em lote
- **Importar Produtos**: Upload de catálogo de produtos
- **Exportar Excel**: Geração de relatórios completos
- Validação de dados durante importação
- Relatório de erros e sucessos

### 🎯 **Autocompletar Inteligente**
- Busca produtos por código ou descrição
- Preenchimento automático de campos
- Sugestões em tempo real
- Interface intuitiva com dropdown

### 🎨 **Interface Responsiva**
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
# Extrair ou clonar o projeto
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

## 📁 Estrutura do Projeto Atualizada

```
nota_fiscal_nodejs/
├── config/
│   └── database.js          # Configuração do Sequelize
├── models/
│   ├── NotaFiscal.js        # Modelo de dados (atualizado)
│   └── Produto.js           # Novo modelo para produtos
├── routes/
│   ├── notaFiscal.js        # Rotas da API (atualizadas)
│   └── produto.js           # Novas rotas para produtos
├── public/                  # Arquivos estáticos
│   ├── index.html           # Interface principal (atualizada)
│   ├── style.css            # Estilos personalizados (atualizados)
│   └── script.js            # Lógica JavaScript (reescrita)
├── uploads/                 # Diretório para arquivos temporários
├── .env                     # Variáveis de ambiente
├── app.js                   # Arquivo principal (atualizado)
├── package.json             # Dependências e scripts (atualizadas)
├── README.md               # Documentação original
└── README_ATUALIZADO.md    # Esta documentação
```

## 🔌 API Endpoints Atualizados

### Notas Fiscais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/notas-fiscais` | Listar todas as notas fiscais |
| POST | `/api/notas-fiscais` | Criar nova nota fiscal |
| PUT | `/api/notas-fiscais/:id` | Atualizar nota fiscal |
| DELETE | `/api/notas-fiscais/:id` | Excluir nota fiscal |
| GET | `/api/notas-fiscais/stats` | Obter estatísticas |
| POST | `/api/notas-fiscais/import` | Importar arquivo Excel |
| **GET** | **`/api/notas-fiscais/export`** | **🆕 Exportar relatório Excel** |

### 🆕 Produtos (Novos Endpoints)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/produtos` | Listar produtos (com busca) |
| GET | `/api/produtos/:codigo` | Buscar produto por código |
| POST | `/api/produtos` | Criar novo produto |
| DELETE | `/api/produtos/:id` | Excluir produto |
| POST | `/api/produtos/import` | Importar produtos de Excel |

### Parâmetros de Busca de Produtos

- `search`: Busca por código ou descrição (busca parcial)

### Exemplo de Busca de Produtos

```javascript
// Buscar produtos por código ou descrição
fetch('/api/produtos?search=4070')
  .then(response => response.json())
  .then(data => console.log(data.data));
```

## 📊 Modelos de Dados Atualizados

### Tabela: nota_fiscal (Atualizada)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único |
| data_abertura | DATE | Data de abertura |
| codigo_produto | VARCHAR(50) | Código do produto |
| descricao | VARCHAR(255) | Descrição do produto |
| medida | VARCHAR(50) | Medida/dimensão |
| **tipo** | **ENUM** | **🆕 'TROCA' ou 'OCORRENCIA'** |
| status | ENUM | 'TROCADO' ou 'DEVOLVIDO' |
| numero_troca | VARCHAR(50) | Número da troca |
| **numero_ocorrencia** | **VARCHAR(50)** | **🆕 Número da ocorrência** |
| data_troca_devolucao | DATE | Data da troca/devolução |
| nf_troca_devolucao | VARCHAR(50) | NF de troca/devolução |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

### 🆕 Tabela: produtos (Nova)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK) | Identificador único |
| codigo | VARCHAR(50) | Código do produto (único) |
| descricao | VARCHAR(255) | Descrição do produto |
| medida | VARCHAR(50) | Medida/dimensão |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data de atualização |

## 📤 Formatos de Arquivos Excel

### Para Importação de Notas Fiscais

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

### 🆕 Para Importação de Produtos

| Coluna Excel | Campo no Sistema |
|--------------|------------------|
| CODIGO (ou CÓDIGO) | codigo |
| DESCRICAO (ou DESCRIÇÃO) | descricao |
| MEDIDA | medida |

**Formato de Data:** dd/mm/aaaa (exemplo: 26/10/2024)

## 🎯 Como Usar as Novas Funcionalidades

### 1. **Cadastrar Nota Fiscal de Troca**
1. Clique em "Cadastrar Nota Fiscal de Troca"
2. Preencha os campos (formato de data: dd/mm/aaaa)
3. Digite o código do produto (autocompletar ativado)
4. Campo "Número da Troca" será exibido
5. Clique em "Salvar"

### 2. **Cadastrar Nota Fiscal de Ocorrência**
1. Clique em "Cadastrar Nota Fiscal de Ocorrência"
2. Preencha os campos (formato de data: dd/mm/aaaa)
3. Digite o código do produto (autocompletar ativado)
4. Campo "Número da Ocorrência" será exibido
5. Clique em "Salvar"

### 3. **Importar Produtos**
1. Clique em "Importar Produtos"
2. Selecione arquivo Excel com colunas: CODIGO, DESCRICAO, MEDIDA
3. Clique em "Importar"
4. Produtos serão adicionados ao sistema para autocompletar

### 4. **Gerar Relatório Excel**
1. Aplique filtros desejados (opcional)
2. Clique em "Gerar Relatório Excel"
3. Arquivo será baixado automaticamente
4. Nome do arquivo inclui data atual

### 5. **Usar Autocompletar**
1. No cadastro de nota fiscal, digite código do produto
2. Sugestões aparecerão automaticamente
3. Clique na sugestão desejada
4. Descrição e medida serão preenchidas automaticamente

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm start      # Executar em produção
npm run dev    # Executar em desenvolvimento
npm test       # Executar testes (não implementado)
```

### Dependências Atualizadas

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "sequelize": "^6.35.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5",
    "exceljs": "^4.4.0"
  }
}
```

## 🚀 Deploy

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
- Upload de arquivos com validação de tipo

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de dependências:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Erro na importação de produtos:**
- Verificar se as colunas do Excel estão corretas
- Certificar-se de que o arquivo está no formato .xlsx ou .xls

**Autocompletar não funciona:**
- Verificar se produtos foram importados
- Verificar conexão com a API

## 📝 Changelog

### v2.0.0 (Versão Atual)
- ✅ **Geração de relatório Excel** com formatação profissional
- ✅ **Formato de data atualizado** para dd/mm/aaaa
- ✅ **Dois tipos de cadastro**: Troca e Ocorrência
- ✅ **Importação de produtos** com autocompletar
- ✅ **Autocompletar inteligente** por código e descrição
- ✅ **Interface aprimorada** com novos botões e campos condicionais
- ✅ **API expandida** com endpoints para produtos
- ✅ **Modelo de dados atualizado** com novos campos

### v1.0.0 (Versão Anterior)
- ✅ Sistema completo de CRUD para notas fiscais
- ✅ Interface web responsiva
- ✅ Importação de arquivos Excel
- ✅ Filtros e pesquisa avançada
- ✅ Dashboard com estatísticas
- ✅ API RESTful completa

## 📞 Suporte

Para suporte técnico:
- Verifique os logs da aplicação
- Consulte a documentação da API
- Verifique as configurações do banco de dados
- Teste as funcionalidades no navegador

---

**Desenvolvido com ❤️ usando Node.js, MySQL e as mais modernas tecnologias web**

## 🎉 **Todas as Solicitações Implementadas!**

✅ **Botão para gerar relatório Excel** - Funcional  
✅ **Formato de data dd/mm/aaaa** - Implementado  
✅ **Botões separados para Troca e Ocorrência** - Funcionais  
✅ **Campos condicionais por tipo** - Implementados  
✅ **Importação de tabela de produtos** - Funcional  
✅ **Autocompletar de produtos** - Implementado  

**Sistema 100% funcional e testado!**

