const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/mysql');

const EnergyConsumption = sequelize.define('EnergyConsumption', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  zona: { type: DataTypes.STRING(120), allowNull: false },
  bulan: { type: DataTypes.STRING(12), allowNull: false },
  tahun: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2024 },
  konsumsi_mwh: { type: DataTypes.FLOAT, allowNull: false },
}, { tableName: 'energy_consumptions', timestamps: true });

const WasteSchedule = sequelize.define('WasteSchedule', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  kelurahan: { type: DataTypes.STRING(120), allowNull: false },
  hari: { type: DataTypes.STRING(80), allowNull: false },
  jam: { type: DataTypes.STRING(40), allowNull: false },
  armada: { type: DataTypes.STRING(80) },
  petugas: { type: DataTypes.STRING(120) },
}, { tableName: 'waste_schedules', timestamps: true });

const FloodReport = sequelize.define('FloodReport', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING(120), allowNull: false },
  lokasi: { type: DataTypes.STRING(180), allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  foto: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.ENUM('pending', 'proses', 'selesai'), defaultValue: 'pending' },
}, { tableName: 'flood_reports', timestamps: true });

const WaterStatus = sequelize.define('WaterStatus', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  wilayah: { type: DataTypes.STRING(120), allowNull: false },
  status: { type: DataTypes.ENUM('Normal', 'Gangguan', 'Pemeliharaan'), defaultValue: 'Normal' },
  debit_lps: { type: DataTypes.FLOAT },
  tekanan_bar: { type: DataTypes.FLOAT },
  estimasi_normal: { type: DataTypes.STRING(120) },
}, { tableName: 'water_statuses', timestamps: true });

const Policy = sequelize.define('Policy', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  judul: { type: DataTypes.STRING(180), allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: false },
  kategori: { type: DataTypes.STRING(80), defaultValue: 'Kebijakan Kota' },
}, { tableName: 'policies', timestamps: true });

const PolicyVote = sequelize.define('PolicyVote', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  policy_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  pilihan: { type: DataTypes.ENUM('setuju', 'tidak_setuju'), allowNull: false },
}, {
  tableName: 'policy_votes',
  timestamps: true,
  indexes: [{ unique: true, fields: ['policy_id', 'user_id'] }],
});

const PolicyThread = sequelize.define('PolicyThread', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  policy_id: { type: DataTypes.INTEGER, allowNull: false },
  judul: { type: DataTypes.STRING(180), allowNull: false },
  dibuat_oleh: { type: DataTypes.STRING(120), allowNull: false },
}, { tableName: 'policy_threads', timestamps: true });

const PolicyComment = sequelize.define('PolicyComment', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  thread_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER },
  nama: { type: DataTypes.STRING(120), allowNull: false },
  komentar: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'policy_comments', timestamps: true });

const CitizenReport = sequelize.define('CitizenReport', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING(120), allowNull: false },
  kategori: { type: DataTypes.STRING(100), allowNull: false },
  deskripsi: { type: DataTypes.TEXT, allowNull: false },
  foto: { type: DataTypes.STRING(255) },
  status: { type: DataTypes.ENUM('pending', 'proses', 'selesai'), defaultValue: 'pending' },
}, { tableName: 'citizen_reports', timestamps: true });

const ServiceSurvey = sequelize.define('ServiceSurvey', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  layanan: { type: DataTypes.STRING(120), allowNull: false },
  periode: { type: DataTypes.STRING(40), allowNull: false },
  skor: { type: DataTypes.FLOAT, allowNull: false },
  responden: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'service_surveys', timestamps: true });

const Announcement = sequelize.define('Announcement', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  judul: { type: DataTypes.STRING(180), allowNull: false },
  isi: { type: DataTypes.TEXT, allowNull: false },
  kategori: { type: DataTypes.STRING(80), defaultValue: 'Resmi' },
  tanggal: { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: 'announcements', timestamps: true });

Policy.hasMany(PolicyVote, { foreignKey: 'policy_id', as: 'votes' });
PolicyVote.belongsTo(Policy, { foreignKey: 'policy_id' });
Policy.hasMany(PolicyThread, { foreignKey: 'policy_id', as: 'threads' });
PolicyThread.belongsTo(Policy, { foreignKey: 'policy_id', as: 'policy' });
PolicyThread.hasMany(PolicyComment, { foreignKey: 'thread_id', as: 'comments' });
PolicyComment.belongsTo(PolicyThread, { foreignKey: 'thread_id' });

module.exports = {
  EnergyConsumption,
  WasteSchedule,
  FloodReport,
  WaterStatus,
  Policy,
  PolicyVote,
  PolicyThread,
  PolicyComment,
  CitizenReport,
  ServiceSurvey,
  Announcement,
};
