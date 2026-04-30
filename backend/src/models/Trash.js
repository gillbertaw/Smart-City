const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const Trash = sequelize.define('Trash', {
  kelurahan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  kecamatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jadwal_hari: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jam_pengangkutan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frekuensi: {
    type: DataTypes.ENUM('Setiap Hari', '2x Seminggu', '3x Seminggu'),
    defaultValue: '2x Seminggu',
  },
  status_hari_ini: {
    type: DataTypes.ENUM('Sudah Diangkut', 'Belum Diangkut', 'Terlambat'),
    defaultValue: 'Belum Diangkut',
  },
  petugas: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  tableName: 'trash_schedules',
});

module.exports = Trash;