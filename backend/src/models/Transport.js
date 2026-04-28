const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const TransportRoute = sequelize.define('TransportRoute', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  kode_rute: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  nama_rute: { type: DataTypes.STRING(200), allowNull: false },
  jenis: { type: DataTypes.ENUM('Bus', 'Angkot', 'BRT'), defaultValue: 'Bus' },
  terminal_awal: { type: DataTypes.STRING(100) },
  terminal_akhir: { type: DataTypes.STRING(100) },
  tarif: { type: DataTypes.INTEGER, defaultValue: 0 },
  jam_operasi_mulai: { type: DataTypes.STRING(10) },
  jam_operasi_selesai: { type: DataTypes.STRING(10) },
  status_aktif: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'transport_routes', timestamps: true });

const TransportSchedule = sequelize.define('TransportSchedule', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  route_id: { type: DataTypes.INTEGER, allowNull: false },
  nama_halte: { type: DataTypes.STRING(150), allowNull: false },
  urutan: { type: DataTypes.INTEGER },
  waktu_keberangkatan: { type: DataTypes.STRING(10) },
  waktu_kedatangan: { type: DataTypes.STRING(10) },
  hari: {
    type: DataTypes.ENUM('Senin-Jumat', 'Sabtu', 'Minggu', 'Setiap Hari'),
    defaultValue: 'Setiap Hari'
  },
}, { tableName: 'transport_schedules', timestamps: true });

TransportRoute.hasMany(TransportSchedule, { foreignKey: 'route_id', as: 'schedules' });
TransportSchedule.belongsTo(TransportRoute, { foreignKey: 'route_id', as: 'route' });

module.exports = { TransportRoute, TransportSchedule };
