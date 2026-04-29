const { sequelize } = require('../config/mysql');
const CityStats = require('../models/CityStats');
const AirQuality = require('../models/AirQuality');
const Traffic = require('../models/Traffic');
const Facility = require('../models/Facility');
const User = require('../models/User');
const { TransportRoute, TransportSchedule } = require('../models/Transport');
const { Policy, PolicyVote } = require('../models/CityService');
const cityServices = require('../controllers/cityServiceController');
const bcrypt = require('bcryptjs');
require('../models/CityService');
require('../models/PublicService');
require('dotenv').config();

const seed = async () => {
  await sequelize.sync({ force: true }); // recreate tables

  // ===== ADMIN USER =====
  await User.create({
    nama: 'Admin Smart City',
    email: 'adminkrabby@gmail.com',
    password: await bcrypt.hash('123admin', 10),
    kota: 'Medan',
    role: 'admin',
    security_question: 'Apa nama kota smart city ini?',
    security_answer: await bcrypt.hash('medan', 10),
  });

  const botPasswordHashes = await Promise.all(
    Array.from({ length: 8 }, (_, i) => bcrypt.hash(`bot${12345 + i}`, 10))
  );
  const botSecurityAnswerHash = await bcrypt.hash('medan', 10);
  const botUsers = await User.bulkCreate(
    botPasswordHashes.map((password, i) => ({
      nama: `Bot Voter ${i + 1}`,
      email: `bot${i + 1}@gmail.com`,
      password,
      kota: 'Medan',
      role: 'warga',
      security_question: 'Apa nama kota smart city ini?',
      security_answer: botSecurityAnswerHash,
    }))
  );

  // ===== CITY STATS =====
  const bulanList = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];
  const basePopulasi = 2200000;
  await CityStats.bulkCreate(bulanList.map((b, i) => ({
    bulan: b, tahun: 2024,
    populasi: basePopulasi + i * 2500,
    kepadatan: 7800 + i * 30,
    energi_gwh: 420 + Math.sin(i) * 40 + i * 5,
    aqi_rata: 65 + Math.sin(i * 0.8) * 25,
  })));

  // ===== AIR QUALITY =====
  await AirQuality.bulkCreate([
    { kecamatan: 'Medan Kota', aqi: 52, pm25: 12.3, pm10: 28.5, co: 0.8, status: 'Sedang', lat: 3.5896, lng: 98.6739 },
    { kecamatan: 'Medan Baru', aqi: 38, pm25: 8.1, pm10: 18.2, co: 0.5, status: 'Baik', lat: 3.5786, lng: 98.6652 },
    { kecamatan: 'Medan Polonia', aqi: 75, pm25: 22.4, pm10: 45.1, co: 1.2, status: 'Tidak Sehat', lat: 3.5587, lng: 98.6797 },
    { kecamatan: 'Medan Sunggal', aqi: 61, pm25: 16.8, pm10: 35.6, co: 1.0, status: 'Sedang', lat: 3.5980, lng: 98.6278 },
    { kecamatan: 'Medan Helvetia', aqi: 45, pm25: 10.5, pm10: 22.9, co: 0.7, status: 'Baik', lat: 3.6199, lng: 98.6433 },
    { kecamatan: 'Medan Timur', aqi: 88, pm25: 28.3, pm10: 58.7, co: 1.8, status: 'Tidak Sehat', lat: 3.5960, lng: 98.7001 },
    { kecamatan: 'Medan Barat', aqi: 42, pm25: 9.7, pm10: 20.1, co: 0.6, status: 'Baik', lat: 3.5946, lng: 98.6484 },
    { kecamatan: 'Medan Petisah', aqi: 56, pm25: 13.9, pm10: 30.8, co: 0.9, status: 'Sedang', lat: 3.5822, lng: 98.6631 },
    { kecamatan: 'Medan Denai', aqi: 112, pm25: 38.1, pm10: 72.4, co: 2.3, status: 'Sangat Tidak Sehat', lat: 3.5664, lng: 98.7123 },
    { kecamatan: 'Medan Amplas', aqi: 67, pm25: 19.2, pm10: 41.3, co: 1.1, status: 'Sedang', lat: 3.5520, lng: 98.6941 },
    { kecamatan: 'Medan Selayang', aqi: 33, pm25: 6.8, pm10: 15.4, co: 0.4, status: 'Baik', lat: 3.6053, lng: 98.6215 },
    { kecamatan: 'Medan Johor', aqi: 79, pm25: 24.6, pm10: 50.2, co: 1.5, status: 'Tidak Sehat', lat: 3.5401, lng: 98.6830 },
  ]);

  // ===== TRAFFIC =====
  await Traffic.bulkCreate([
    { nama_jalan: 'Jl. Gatot Subroto', ruas: 'Simpang Pos - Simpang Sunggal', status: 'Macet', kecepatan_kmh: 8, kendaraan_per_jam: 3200, lat_start: 3.5875, lng_start: 98.6543, lat_end: 3.6012, lng_end: 98.6401 },
    { nama_jalan: 'Jl. Adam Malik', ruas: 'Simpang Sei Sikambing - Simpang Glugur', status: 'Padat', kecepatan_kmh: 22, kendaraan_per_jam: 2100, lat_start: 3.5978, lng_start: 98.6712, lat_end: 3.6100, lng_end: 98.6789 },
    { nama_jalan: 'Jl. Diponegoro', ruas: 'Simpang Rambung - Simpang Aksara', status: 'Lancar', kecepatan_kmh: 42, kendaraan_per_jam: 980, lat_start: 3.5755, lng_start: 98.6828, lat_end: 3.5821, lng_end: 98.6921 },
    { nama_jalan: 'Jl. Sisingamangaraja', ruas: 'Simpang Limun - Simpang Simalingkar', status: 'Macet', kecepatan_kmh: 5, kendaraan_per_jam: 4100, lat_start: 3.5478, lng_start: 98.6802, lat_end: 3.5342, lng_end: 98.6654 },
    { nama_jalan: 'Jl. Brigjen Katamso', ruas: 'Simpang Joni - Simpang Juanda', status: 'Lancar', kecepatan_kmh: 50, kendaraan_per_jam: 750, lat_start: 3.5821, lng_start: 98.7012, lat_end: 3.5690, lng_end: 98.7098 },
    { nama_jalan: 'Jl. Guru Patimpus', ruas: 'Simpang Glugur - Simpang Pos', status: 'Padat', kecepatan_kmh: 18, kendaraan_per_jam: 1800, lat_start: 3.5996, lng_start: 98.6830, lat_end: 3.5876, lng_end: 98.6720 },
    { nama_jalan: 'Jl. Yos Sudarso', ruas: 'Belawan - Simpang Mabar', status: 'Lancar', kecepatan_kmh: 60, kendaraan_per_jam: 520, lat_start: 3.7001, lng_start: 98.6905, lat_end: 3.6455, lng_end: 98.7012 },
    { nama_jalan: 'Jl. Ring Road', ruas: 'Simpang Padang Bulan - Simpang Simalingkar', status: 'Padat', kecepatan_kmh: 25, kendaraan_per_jam: 2300, lat_start: 3.5700, lng_start: 98.6350, lat_end: 3.5400, lng_end: 98.6450 },
  ]);

  // ===== FACILITIES =====
  await Facility.bulkCreate([
    { nama: 'RSUD Dr. Pirngadi Medan', jenis: 'Rumah Sakit', alamat: 'Jl. Prof. H.M. Yamin SH No.47', kecamatan: 'Medan Timur', telepon: '061-4512800', jam_buka: '24 Jam', lat: 3.5913, lng: 98.6989, deskripsi: 'Rumah sakit umum milik pemerintah kota Medan' },
    { nama: 'RS Columbia Asia Medan', jenis: 'Rumah Sakit', alamat: 'Jl. Listrik No.2A', kecamatan: 'Medan Petisah', telepon: '061-4566368', jam_buka: '24 Jam', lat: 3.5812, lng: 98.6658, deskripsi: 'Rumah sakit swasta internasional' },
    { nama: 'RS Haji Medan', jenis: 'Rumah Sakit', alamat: 'Jl. RS Haji', kecamatan: 'Medan Johor', telepon: '061-7864741', jam_buka: '24 Jam', lat: 3.5389, lng: 98.6912, deskripsi: 'Rumah sakit daerah Provinsi Sumatera Utara' },
    { nama: 'SMA Negeri 1 Medan', jenis: 'Sekolah', alamat: 'Jl. Teuku Cik Ditiro No.1', kecamatan: 'Medan Baru', telepon: '061-4572748', jam_buka: '07:00 - 15:00', lat: 3.5793, lng: 98.6691, deskripsi: 'SMA unggulan kota Medan' },
    { nama: 'SMA Negeri 4 Medan', jenis: 'Sekolah', alamat: 'Jl. Budi Kemasyarakatan No.3', kecamatan: 'Medan Sunggal', telepon: '061-8441490', jam_buka: '07:00 - 15:00', lat: 3.5950, lng: 98.6421, deskripsi: 'Sekolah menengah atas negeri favorit' },
    { nama: 'Universitas Sumatera Utara', jenis: 'Sekolah', alamat: 'Jl. Universitas No.9', kecamatan: 'Medan Baru', telepon: '061-8211633', jam_buka: '07:00 - 17:00', lat: 3.5700, lng: 98.6500, deskripsi: 'Universitas negeri terkemuka di Sumatera' },
    { nama: 'Taman Sri Deli', jenis: 'Taman', alamat: 'Jl. Brigadir Jenderal Katamso', kecamatan: 'Medan Kota', telepon: null, jam_buka: '06:00 - 22:00', lat: 3.5912, lng: 98.6812, deskripsi: 'Taman kota bersejarah di pusat Medan' },
    { nama: 'Taman Cadika Pramuka', jenis: 'Taman', alamat: 'Jl. Karya Wisata', kecamatan: 'Medan Johor', telepon: null, jam_buka: '06:00 - 21:00', lat: 3.5501, lng: 98.7005, deskripsi: 'Taman rekreasi dan area pramuka' },
    { nama: 'Taman Ahmad Yani', jenis: 'Taman', alamat: 'Jl. Diponegoro', kecamatan: 'Medan Polonia', telepon: null, jam_buka: '05:00 - 23:00', lat: 3.5740, lng: 98.6750, deskripsi: 'Taman hijau di pusat kota' },
    { nama: 'Balai Kota Medan', jenis: 'Kantor Pemerintah', alamat: 'Jl. Kapten Maulana Lubis No.2', kecamatan: 'Medan Petisah', telepon: '061-4512412', jam_buka: 'Sen-Jum 08:00-16:00', lat: 3.5908, lng: 98.6693, deskripsi: 'Kantor walikota Medan' },
    { nama: 'Kantor Gubernur Sumatera Utara', jenis: 'Kantor Pemerintah', alamat: 'Jl. Diponegoro No.30', kecamatan: 'Medan Polonia', telepon: '061-4156000', jam_buka: 'Sen-Jum 08:00-16:00', lat: 3.5775, lng: 98.6720, deskripsi: 'Gedung pemerintah provinsi Sumatera Utara' },
    { nama: 'Masjid Raya Al-Mashun', jenis: 'Masjid', alamat: 'Jl. Sisingamangaraja', kecamatan: 'Medan Kota', telepon: null, jam_buka: '05:00 - 22:00', lat: 3.5883, lng: 98.6876, deskripsi: 'Masjid bersejarah warisan kesultanan Deli' },
    { nama: 'Pasar Petisah', jenis: 'Pasar', alamat: 'Jl. Kota Baru', kecamatan: 'Medan Petisah', telepon: null, jam_buka: '06:00 - 18:00', lat: 3.5835, lng: 98.6618, deskripsi: 'Pasar tradisional terbesar di Medan' },
  ]);

  // ===== TRANSPORT =====
  const routes = await TransportRoute.bulkCreate([
    { kode_rute: 'BUS-01', nama_rute: 'Amplas - Pinang Baris', jenis: 'Bus', terminal_awal: 'Terminal Amplas', terminal_akhir: 'Terminal Pinang Baris', tarif: 5000, jam_operasi_mulai: '05:30', jam_operasi_selesai: '21:00', status_aktif: true },
    { kode_rute: 'BUS-02', nama_rute: 'Belawan - Amplas', jenis: 'Bus', terminal_awal: 'Pelabuhan Belawan', terminal_akhir: 'Terminal Amplas', tarif: 7000, jam_operasi_mulai: '06:00', jam_operasi_selesai: '20:00', status_aktif: true },
    { kode_rute: 'AK-03', nama_rute: 'Pasar Petisah - Helvetia', jenis: 'Angkot', terminal_awal: 'Pasar Petisah', terminal_akhir: 'Helvetia Permai', tarif: 3000, jam_operasi_mulai: '06:00', jam_operasi_selesai: '20:30', status_aktif: true },
    { kode_rute: 'AK-04', nama_rute: 'Simpang Pos - Tembung', jenis: 'Angkot', terminal_awal: 'Simpang Pos', terminal_akhir: 'Tembung', tarif: 3000, jam_operasi_mulai: '06:30', jam_operasi_selesai: '19:00', status_aktif: true },
    { kode_rute: 'BRT-01', nama_rute: 'Trans Mebidang Koridor 1', jenis: 'BRT', terminal_awal: 'Shelter Amplas', terminal_akhir: 'Shelter Binjai Raya', tarif: 4000, jam_operasi_mulai: '05:00', jam_operasi_selesai: '22:00', status_aktif: true },
    { kode_rute: 'BRT-02', nama_rute: 'Trans Mebidang Koridor 2', jenis: 'BRT', terminal_awal: 'Shelter Helvetia', terminal_akhir: 'Shelter Deli Tua', tarif: 4000, jam_operasi_mulai: '05:00', jam_operasi_selesai: '22:00', status_aktif: false },
  ]);

  const scheduleData = [
    // BUS-01
    { route_id: routes[0].id, nama_halte: 'Terminal Amplas', urutan: 1, waktu_keberangkatan: '05:30', waktu_kedatangan: '05:30', hari: 'Setiap Hari' },
    { route_id: routes[0].id, nama_halte: 'Simpang Limun', urutan: 2, waktu_keberangkatan: '05:45', waktu_kedatangan: '05:43', hari: 'Setiap Hari' },
    { route_id: routes[0].id, nama_halte: 'Pasar Petisah', urutan: 3, waktu_keberangkatan: '06:05', waktu_kedatangan: '06:03', hari: 'Setiap Hari' },
    { route_id: routes[0].id, nama_halte: 'Simpang Pos', urutan: 4, waktu_keberangkatan: '06:25', waktu_kedatangan: '06:23', hari: 'Setiap Hari' },
    { route_id: routes[0].id, nama_halte: 'Terminal Pinang Baris', urutan: 5, waktu_keberangkatan: '06:50', waktu_kedatangan: '06:48', hari: 'Setiap Hari' },
    // BUS-02
    { route_id: routes[1].id, nama_halte: 'Pelabuhan Belawan', urutan: 1, waktu_keberangkatan: '06:00', waktu_kedatangan: '06:00', hari: 'Setiap Hari' },
    { route_id: routes[1].id, nama_halte: 'Simpang Mabar', urutan: 2, waktu_keberangkatan: '06:20', waktu_kedatangan: '06:18', hari: 'Setiap Hari' },
    { route_id: routes[1].id, nama_halte: 'Pasar Glugur', urutan: 3, waktu_keberangkatan: '06:50', waktu_kedatangan: '06:48', hari: 'Setiap Hari' },
    { route_id: routes[1].id, nama_halte: 'Simpang Pos', urutan: 4, waktu_keberangkatan: '07:20', waktu_kedatangan: '07:18', hari: 'Setiap Hari' },
    { route_id: routes[1].id, nama_halte: 'Terminal Amplas', urutan: 5, waktu_keberangkatan: '07:50', waktu_kedatangan: '07:48', hari: 'Setiap Hari' },
    // AK-03
    { route_id: routes[2].id, nama_halte: 'Pasar Petisah', urutan: 1, waktu_keberangkatan: '06:00', waktu_kedatangan: '06:00', hari: 'Senin-Jumat' },
    { route_id: routes[2].id, nama_halte: 'Simpang Setia Budi', urutan: 2, waktu_keberangkatan: '06:15', waktu_kedatangan: '06:13', hari: 'Senin-Jumat' },
    { route_id: routes[2].id, nama_halte: 'Helvetia Permai', urutan: 3, waktu_keberangkatan: '06:35', waktu_kedatangan: '06:33', hari: 'Senin-Jumat' },
    // AK-04
    { route_id: routes[3].id, nama_halte: 'Simpang Pos', urutan: 1, waktu_keberangkatan: '06:30', waktu_kedatangan: '06:30', hari: 'Setiap Hari' },
    { route_id: routes[3].id, nama_halte: 'Bandar Selamat', urutan: 2, waktu_keberangkatan: '06:45', waktu_kedatangan: '06:43', hari: 'Setiap Hari' },
    { route_id: routes[3].id, nama_halte: 'Tembung', urutan: 3, waktu_keberangkatan: '07:00', waktu_kedatangan: '06:58', hari: 'Setiap Hari' },
    // BRT-01
    { route_id: routes[4].id, nama_halte: 'Shelter Amplas', urutan: 1, waktu_keberangkatan: '05:00', waktu_kedatangan: '05:00', hari: 'Setiap Hari' },
    { route_id: routes[4].id, nama_halte: 'Shelter Sisingamangaraja', urutan: 2, waktu_keberangkatan: '05:12', waktu_kedatangan: '05:10', hari: 'Setiap Hari' },
    { route_id: routes[4].id, nama_halte: 'Shelter Balai Kota', urutan: 3, waktu_keberangkatan: '05:22', waktu_kedatangan: '05:20', hari: 'Setiap Hari' },
    { route_id: routes[4].id, nama_halte: 'Shelter Adam Malik', urutan: 4, waktu_keberangkatan: '05:34', waktu_kedatangan: '05:32', hari: 'Setiap Hari' },
    { route_id: routes[4].id, nama_halte: 'Shelter Binjai Raya', urutan: 5, waktu_keberangkatan: '05:55', waktu_kedatangan: '05:53', hari: 'Setiap Hari' },
  ];
  await TransportSchedule.bulkCreate(scheduleData);

  // ===== CITY SERVICES + BOT VOTES =====
  await cityServices.seedIfEmpty();
  const policies = await Policy.findAll({ order: [['id', 'ASC']] });
  await PolicyVote.bulkCreate(policies.flatMap((policy, policyIndex) => (
    botUsers.map((user, userIndex) => ({
      policy_id: policy.id,
      user_id: user.id,
      pilihan: (policyIndex + userIndex) % 3 === 0 ? 'tidak_setuju' : 'setuju',
    }))
  )));

  console.log('✅ Seed data berhasil!');
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
