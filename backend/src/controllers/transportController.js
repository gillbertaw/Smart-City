const { TransportRoute, TransportSchedule } = require('../models/Transport');

exports.getRoutes = async (req, res) => {
  try {
    const data = await TransportRoute.findAll({
      order: [['kode_rute', 'ASC']],
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRouteWithSchedules = async (req, res) => {
  try {
    const data = await TransportRoute.findOne({
      where: { id: req.params.id },
      include: [{ model: TransportSchedule, as: 'schedules', order: [['urutan', 'ASC']] }],
    });
    if (!data) return res.status(404).json({ success: false, message: 'Rute tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
