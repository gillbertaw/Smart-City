const AirQuality = require('../models/AirQuality');

exports.getAll = async (req, res) => {
  try {
    const data = await AirQuality.findAll({ order: [['aqi', 'DESC']] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getByKecamatan = async (req, res) => {
  try {
    const data = await AirQuality.findOne({ where: { kecamatan: req.params.kecamatan } });
    if (!data) return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
