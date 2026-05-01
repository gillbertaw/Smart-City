const CityStats = require('../models/CityStats');
const AirQuality = require('../models/AirQuality');
const Traffic = require('../models/Traffic');
const { TransportRoute } = require('../models/Transport');
const Facility = require('../models/Facility');

exports.getCityStats = async (req, res) => {
  try {
    const stats = await CityStats.findAll({ order: [['tahun', 'ASC'], ['id', 'ASC']] });
    const latest = stats[stats.length - 1];
    const summary = {
      populasi: latest?.populasi || 0,
      kepadatan: latest?.kepadatan || 0,
      energi_gwh: latest?.energi_gwh || 0,
      aqi_rata: latest?.aqi_rata || 0,
    };
    res.json({ success: true, data: { chart: stats, summary } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOverview = async (req, res) => {
  try {
    const [totalFasilitas, totalRute, totalJalan, avgAqi] = await Promise.all([
      Facility.count(),
      TransportRoute.count({ where: { status_aktif: true } }),
      Traffic.count(),
      AirQuality.findOne({ attributes: [[require('sequelize').fn('AVG', require('sequelize').col('aqi')), 'avg_aqi']] }),
    ]);
    res.json({ success: true, data: { totalFasilitas, totalRute, totalJalan, avgAqi: parseFloat(avgAqi?.dataValues?.avg_aqi || 0).toFixed(1) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
