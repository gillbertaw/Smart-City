const Facility = require('../models/Facility');

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.jenis) where.jenis = req.query.jenis;
    const data = await Facility.findAll({ where, order: [['nama', 'ASC']] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
