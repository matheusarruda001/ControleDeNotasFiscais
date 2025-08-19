const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const NotaFiscal = require('../models/NotaFiscal');

const router = express.Router();

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Função para converter data do formato dd/mm/aaaa para YYYY-MM-DD
function convertDateFormat(dateStr) {
  if (!dateStr) return null;
  
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  let year = parts[2];
  
  // Se o ano tem 2 dígitos, assumir século 21
  if (year.length === 2) {
    year = '20' + year;
  }
  
  return `${year}-${month}-${day}`;
}

// Função para converter data do formato YYYY-MM-DD para dd/mm/aaaa
function formatDateForDisplay(dateStr) {
  if (!dateStr) return null;
  
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// GET /api/notas-fiscais - Listar todas as notas fiscais com filtros
router.get('/', async (req, res) => {
  try {
    const { status, codigo_produto, data_inicio, data_fim, baixado_consignado } = req.query;
    
    let whereClause = {};
    
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    
    if (codigo_produto) {
      whereClause.codigoProduto = {
        [Op.like]: `%${codigo_produto}%`
      };
    }
    
    if (baixado_consignado) {
      whereClause.baixadoConsignado = baixado_consignado.toUpperCase();
    }
    
    if (data_inicio || data_fim) {
      whereClause.dataAbertura = {};
      if (data_inicio) {
        whereClause.dataAbertura[Op.gte] = data_inicio;
      }
      if (data_fim) {
        whereClause.dataAbertura[Op.lte] = data_fim;
      }
    }
    
    const notas = await NotaFiscal.findAll({
      where: whereClause,
      order: [['dataAbertura', 'DESC']]
    });
    
    // Formatar dados para o frontend
    const notasFormatadas = notas.map(nota => ({
      id: nota.id,
      data_abertura: formatDateForDisplay(nota.dataAbertura),
      codigo_produto: nota.codigoProduto,
      descricao: nota.descricao,
      medida: nota.medida,
      tipo: nota.tipo,
      status: nota.status,
      numero_troca: nota.numeroTroca,
      numero_ocorrencia: nota.numeroOcorrencia,
      data_troca_devolucao: formatDateForDisplay(nota.dataTrocaDevolucao),
      nf_troca_devolucao: nota.nfTrocaDevolucao,
      baixado_consignado: nota.baixadoConsignado,
      created_at: nota.createdAt,
      updated_at: nota.updatedAt
    }));
    
    res.json({
      success: true,
      data: notasFormatadas,
      total: notasFormatadas.length
    });
  } catch (error) {
    console.error('Erro ao buscar notas fiscais:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/notas-fiscais - Criar nova nota fiscal
router.post('/', async (req, res) => {
  try {
    const {
      data_abertura,
      codigo_produto,
      descricao,
      medida,
      tipo,
      status,
      numero_troca,
      numero_ocorrencia,
      data_troca_devolucao,
      nf_troca_devolucao,
      baixado_consignado
    } = req.body;
    
    // Validação básica
    if (!data_abertura || !codigo_produto || !descricao || !status) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: data_abertura, codigo_produto, descricao, status'
      });
    }
    
    const nota = await NotaFiscal.create({
      dataAbertura: convertDateFormat(data_abertura),
      codigoProduto: codigo_produto,
      descricao,
      medida,
      tipo: tipo || 'TROCA',
      status: status.toUpperCase(),
      numeroTroca: numero_troca,
      numeroOcorrencia: numero_ocorrencia,
      dataTrocaDevolucao: convertDateFormat(data_troca_devolucao),
      nfTrocaDevolucao: nf_troca_devolucao,
      baixadoConsignado: baixado_consignado ? baixado_consignado.toUpperCase() : 'NAO'
    });
    
    res.status(201).json({
      success: true,
      data: nota,
      message: 'Nota fiscal criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/notas-fiscais/:id - Atualizar nota fiscal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      data_abertura,
      codigo_produto,
      descricao,
      medida,
      status,
      numero_troca,
      data_troca_devolucao,
      nf_troca_devolucao
    } = req.body;
    
    const nota = await NotaFiscal.findByPk(id);
    
    if (!nota) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    await nota.update({
      dataAbertura: data_abertura ? convertDateFormat(data_abertura) : nota.dataAbertura,
      codigoProduto: codigo_produto || nota.codigoProduto,
      descricao: descricao || nota.descricao,
      medida: medida !== undefined ? medida : nota.medida,
      status: status ? status.toUpperCase() : nota.status,
      numeroTroca: numero_troca !== undefined ? numero_troca : nota.numeroTroca,
      dataTrocaDevolucao: data_troca_devolucao ? convertDateFormat(data_troca_devolucao) : nota.dataTrocaDevolucao,
      nfTrocaDevolucao: nf_troca_devolucao !== undefined ? nf_troca_devolucao : nota.nfTrocaDevolucao
    });
    
    res.json({
      success: true,
      data: nota,
      message: 'Nota fiscal atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar nota fiscal:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/notas-fiscais/:id - Excluir nota fiscal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const nota = await NotaFiscal.findByPk(id);
    
    if (!nota) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    await nota.destroy();
    
    res.json({
      success: true,
      message: 'Nota fiscal excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir nota fiscal:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/notas-fiscais/import - Importar dados de Excel
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
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];
        
        // Mapear colunas do Excel
        const notaData = {
          dataAbertura: convertDateFormat(row['DATA DA ABERTURA']),
          codigoProduto: String(row['CODIGO DO PRODUTO'] || ''),
          descricao: row['DESCRIÇÃO'] || '',
          medida: row['MEDIDA'] || null,
          status: (row['TROCADO OU DEVOLVIDO'] || '').toUpperCase(),
          numeroTroca: row['n° da TROCA'] ? String(row['n° da TROCA']) : null,
          dataTrocaDevolucao: convertDateFormat(row['DATA DA TROCA/DEVOLUÇÃO']),
          nfTrocaDevolucao: row['NF DA TROCA/NF DA DEVOLUÇÃO'] ? String(row['NF DA TROCA/NF DA DEVOLUÇÃO']) : null
        };
        
        // Verificar se já existe
        const existing = await NotaFiscal.findOne({
          where: {
            codigoProduto: notaData.codigoProduto,
            numeroTroca: notaData.numeroTroca
          }
        });
        
        if (!existing) {
          await NotaFiscal.create(notaData);
          importedCount++;
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
      message: `${importedCount} registros importados com sucesso`,
      imported_count: importedCount,
      errors
    });
  } catch (error) {
    console.error('Erro ao importar arquivo:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/notas-fiscais/stats - Estatísticas
router.get('/stats', async (req, res) => {
  try {
    const total = await NotaFiscal.count();
    const trocados = await NotaFiscal.count({ where: { status: 'TROCADO' } });
    const devolvidos = await NotaFiscal.count({ where: { status: 'DEVOLVIDO' } });
    
    res.json({
      success: true,
      data: {
        total,
        trocados,
        devolvidos
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;


// GET /api/notas-fiscais/export - Exportar relatório em Excel
router.get('/export', async (req, res) => {
  try {
    const { status, codigo_produto, data_inicio, data_fim, baixado_consignado } = req.query;
    
    let whereClause = {};
    
    if (status) {
      whereClause.status = status.toUpperCase();
    }
    
    if (codigo_produto) {
      whereClause.codigoProduto = {
        [Op.like]: `%${codigo_produto}%`
      };
    }
    
    if (baixado_consignado) {
      whereClause.baixadoConsignado = baixado_consignado.toUpperCase();
    }
    
    if (data_inicio || data_fim) {
      whereClause.dataAbertura = {};
      if (data_inicio) {
        whereClause.dataAbertura[Op.gte] = data_inicio;
      }
      if (data_fim) {
        whereClause.dataAbertura[Op.lte] = data_fim;
      }
    }
    
    const notas = await NotaFiscal.findAll({
      where: whereClause,
      order: [['dataAbertura', 'DESC']]
    });
    
    // Criar workbook do Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Relatório de Notas Fiscais');
    
    // Definir cabeçalhos
    worksheet.columns = [
      { header: 'Data de Abertura', key: 'dataAbertura', width: 15 },
      { header: 'Código do Produto', key: 'codigoProduto', width: 20 },
      { header: 'Descrição', key: 'descricao', width: 30 },
      { header: 'Medida', key: 'medida', width: 15 },
      { header: 'Tipo', key: 'tipo', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Nº da Troca', key: 'numeroTroca', width: 15 },
      { header: 'Nº da Ocorrência', key: 'numeroOcorrencia', width: 18 },
      { header: 'Data Troca/Devolução', key: 'dataTrocaDevolucao', width: 18 },
      { header: 'NF Troca/Devolução', key: 'nfTrocaDevolucao', width: 18 },
      { header: 'Baixado do Consignado', key: 'baixadoConsignado', width: 20 }
    ];
    
    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Adicionar dados
    notas.forEach(nota => {
      worksheet.addRow({
        dataAbertura: formatDateForDisplay(nota.dataAbertura),
        codigoProduto: nota.codigoProduto,
        descricao: nota.descricao,
        medida: nota.medida || '',
        tipo: nota.tipo,
        status: nota.status,
        numeroTroca: nota.numeroTroca || '',
        numeroOcorrencia: nota.numeroOcorrencia || '',
        dataTrocaDevolucao: formatDateForDisplay(nota.dataTrocaDevolucao),
        nfTrocaDevolucao: nota.nfTrocaDevolucao || '',
        baixadoConsignado: nota.baixadoConsignado
      });
    });
    
    // Configurar resposta
    const fileName = `relatorio_notas_fiscais_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Enviar arquivo
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

