const Traffic = require('../models/Traffic');

exports.getAll = async (req, res) => {
  try {
    const data = await Traffic.findAll({ order: [['status', 'ASC'], ['nama_jalan', 'ASC']] });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const [lancar, padat, macet] = await Promise.all([
      Traffic.count({ where: { status: 'Lancar' } }),
      Traffic.count({ where: { status: 'Padat' } }),
      Traffic.count({ where: { status: 'Macet' } }),
    ]);
    res.json({ success: true, data: { lancar, padat, macet, total: lancar + padat + macet } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
