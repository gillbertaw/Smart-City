const Trash = require('../models/Trash');

exports.getAll = async (req, res) => {
  try {
    const data = await Trash.findAll({ order: [['kecamatan', 'ASC']] });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByKecamatan = async (req, res) => {
  try {
    const data = await Trash.findAll({
      where: { kecamatan: req.params.kecamatan },
      order: [['kelurahan', 'ASC']],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};