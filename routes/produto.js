const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { Op } = require('sequelize');
const Produto = require('../models/Produto');

const router = express.Router();

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { codigo: { [Op.like]: `%${search}%` } },
          { descricao: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    const produtos = await Produto.findAll({
      where: whereClause,
      order: [['descricao', 'ASC']],
      limit: 50 // Limitar resultados para performance
    });
    
    res.json({
      success: true,
      data: produtos
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/produtos/:codigo - Buscar produto por código
router.get('/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    
    const produto = await Produto.findOne({
      where: { codigo }
    });
    
    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: produto
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/produtos - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { codigo, descricao, medida } = req.body;
    
    if (!codigo || !descricao) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: codigo, descricao'
      });
    }
    
    const produto = await Produto.create({
      codigo,
      descricao,
      medida
    });
    
    res.status(201).json({
      success: true,
      data: produto,
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'Código do produto já existe'
      });
    }
    
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/produtos/import - Importar produtos de Excel
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado'
      });
    }
    
    // Ler arquivo Excel
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    let importedCount = 0;
    let updatedCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Mapear colunas do Excel (flexível para diferentes formatos)
        const codigo = String(row['CODIGO'] || row['CÓDIGO'] || row['CODIGO DO PRODUTO'] || row['codigo'] || '').trim();
        const descricao = String(row['DESCRICAO'] || row['DESCRIÇÃO'] || row['descricao'] || '').trim();
        const medida = String(row['MEDIDA'] || row['medida'] || '').trim() || null;
        
        if (!codigo || !descricao) {
          errors.push(`Linha ${i + 2}: Código e descrição são obrigatórios`);
          continue;
        }
        
        // Verificar se já existe
        const [produto, created] = await Produto.findOrCreate({
          where: { codigo },
          defaults: { codigo, descricao, medida }
        });
        
        if (created) {
          importedCount++;
        } else {
          // Atualizar produto existente
          await produto.update({ descricao, medida });
          updatedCount++;
        }
      } catch (error) {
        errors.push(`Linha ${i + 2}: ${error.message}`);
      }
    }
    
    // Remover arquivo temporário
    const fs = require('fs');
    fs.unlinkSync(req.file.path);
    
    res.json({
      success: true,
      message: `${importedCount} produtos importados, ${updatedCount} atualizados`,
      imported_count: importedCount,
      updated_count: updatedCount,
      errors
    });
  } catch (error) {
    console.error('Erro ao importar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/produtos/:id - Excluir produto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const produto = await Produto.findByPk(id);
    
    if (!produto) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    await produto.destroy();
    
    res.json({
      success: true,
      message: 'Produto excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

