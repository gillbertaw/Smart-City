const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const AirQuality = sequelize.define('AirQuality', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  kecamatan: { type: DataTypes.STRING(100), allowNull: false },
  aqi: { type: DataTypes.INTEGER, allowNull: false },
  pm25: { type: DataTypes.FLOAT },
  pm10: { type: DataTypes.FLOAT },
  co: { type: DataTypes.FLOAT },
  status: {
    type: DataTypes.ENUM('Baik', 'Sedang', 'Tidak Sehat', 'Sangat Tidak Sehat', 'Berbahaya'),
    defaultValue: 'Baik'
  },
  lat: { type: DataTypes.FLOAT },
  lng: { type: DataTypes.FLOAT },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'air_quality', timestamps: true });

module.exports = AirQuality;
