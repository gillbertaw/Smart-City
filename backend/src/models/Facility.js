const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Facility = sequelize.define('Facility', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING(200), allowNull: false },
  jenis: {
    type: DataTypes.ENUM('Rumah Sakit', 'Sekolah', 'Taman', 'Kantor Pemerintah', 'Pasar', 'Masjid'),
    allowNull: false
  },
  alamat: { type: DataTypes.STRING(300) },
  kecamatan: { type: DataTypes.STRING(100) },
  telepon: { type: DataTypes.STRING(30) },
  jam_buka: { type: DataTypes.STRING(50) },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
}, { tableName: 'facilities', timestamps: true });

module.exports = Facility;
