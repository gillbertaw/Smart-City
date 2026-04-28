const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const CityStats = sequelize.define('CityStats', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bulan: { type: DataTypes.STRING(20), allowNull: false },
  tahun: { type: DataTypes.INTEGER, allowNull: false },
  populasi: { type: DataTypes.INTEGER, defaultValue: 0 },
  kepadatan: { type: DataTypes.FLOAT, defaultValue: 0 }, // jiwa/km²
  energi_gwh: { type: DataTypes.FLOAT, defaultValue: 0 },
  aqi_rata: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { tableName: 'city_stats', timestamps: true });

module.exports = CityStats;
