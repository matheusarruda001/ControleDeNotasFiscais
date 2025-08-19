const express = require('express');
const NotaFiscal = require('../models/NotaFiscal');

const router = express.Router();

// PUT /api/baixar-consignado/:id - Atualizar status de baixado do consignado
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { baixado_consignado } = req.body;
    
    if (!baixado_consignado || !['SIM', 'NAO'].includes(baixado_consignado.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: 'Campo baixado_consignado deve ser SIM ou NAO'
      });
    }
    
    const nota = await NotaFiscal.findByPk(id);
    
    if (!nota) {
      return res.status(404).json({
        success: false,
        error: 'Nota fiscal não encontrada'
      });
    }
    
    await nota.update({
      baixadoConsignado: baixado_consignado.toUpperCase()
    });
    
    res.json({
      success: true,
      message: `Status de baixado do consignado atualizado para ${baixado_consignado.toUpperCase()}`,
      data: {
        id: nota.id,
        baixado_consignado: nota.baixadoConsignado
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar status de baixado do consignado:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;

