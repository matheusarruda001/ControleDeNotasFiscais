const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  medida: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'produtos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Produto;

