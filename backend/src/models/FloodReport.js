const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/mysql");

const FloodReport = sequelize.define(
  "FloodReport",
  {
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kecamatan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kelurahan: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    tinggi_air_cm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    keterangan: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    pelapor: {
      type: DataTypes.STRING,
      defaultValue: "Anonim",
    },
    waktu_laporan: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status_verifikasi: {
      type: DataTypes.ENUM("Menunggu", "Terverifikasi", "Ditolak", "Selesai"),
      defaultValue: "Menunggu",
    },
  },
  {
    tableName: "flood_reports",
  },
);

module.exports = FloodReport;
