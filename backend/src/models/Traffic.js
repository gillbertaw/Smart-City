const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Traffic = sequelize.define('Traffic', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama_jalan: { type: DataTypes.STRING(150), allowNull: false },
  ruas: { type: DataTypes.STRING(200) },
  status: {
    type: DataTypes.ENUM('Lancar', 'Padat', 'Macet'),
    defaultValue: 'Lancar'
  },
  kecepatan_kmh: { type: DataTypes.INTEGER },
  kendaraan_per_jam: { type: DataTypes.INTEGER },
  lat_start: { type: DataTypes.FLOAT },
  lng_start: { type: DataTypes.FLOAT },
  lat_end: { type: DataTypes.FLOAT },
  lng_end: { type: DataTypes.FLOAT },
}, { tableName: 'traffic', timestamps: true });

module.exports = Traffic;
