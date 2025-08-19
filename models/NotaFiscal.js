const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NotaFiscal = sequelize.define('NotaFiscal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  dataAbertura: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_abertura'
  },
  codigoProduto: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'codigo_produto'
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  medida: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('TROCA', 'OCORRENCIA'),
    allowNull: false,
    defaultValue: 'TROCA'
  },
  status: {
    type: DataTypes.ENUM('TROCADO', 'DEVOLVIDO'),
    allowNull: false
  },
  numeroTroca: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'numero_troca'
  },
  numeroOcorrencia: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'numero_ocorrencia'
  },
  dataTrocaDevolucao: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'data_troca_devolucao'
  },
  nfTrocaDevolucao: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'nf_troca_devolucao'
  },
  baixadoConsignado: {
    type: DataTypes.ENUM('SIM', 'NAO'),
    allowNull: false,
    defaultValue: 'NAO',
    field: 'baixado_consignado'
  }
}, {
  tableName: 'nota_fiscal',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = NotaFiscal;

