const FloodReport = require("../models/FloodReport");
const { Op } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const data = await FloodReport.findAll({
      where: { status_verifikasi: { [Op.ne]: "Selesai" } },
      order: [["waktu_laporan", "DESC"]],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getByKecamatan = async (req, res) => {
  try {
    const data = await FloodReport.findAll({
      where: { kecamatan: req.params.kecamatan },
      order: [["waktu_laporan", "DESC"]],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { lokasi, kecamatan, kelurahan, tinggi_air_cm, keterangan, pelapor } =
      req.body;

    if (!lokasi || !kecamatan || !tinggi_air_cm) {
      return res.status(400).json({
        success: false,
        message: "Field lokasi, kecamatan, dan tinggi_air_cm wajib diisi.",
      });
    }

    const laporan = await FloodReport.create({
      lokasi,
      kecamatan,
      kelurahan: kelurahan || "",
      tinggi_air_cm: parseInt(tinggi_air_cm),
      keterangan: keterangan || "",
      pelapor: pelapor || "Anonim",
      waktu_laporan: new Date(),
      status_verifikasi: "Menunggu",
    });

    res.status(201).json({ success: true, data: laporan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_verifikasi } = req.body;

    const laporan = await FloodReport.findByPk(id);
    if (!laporan) {
      return res
        .status(404)
        .json({ success: false, message: "Laporan tidak ditemukan." });
    }

    laporan.status_verifikasi = status_verifikasi;
    await laporan.save();

    res.json({ success: true, data: laporan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const laporan = await FloodReport.findByPk(id);
    if (!laporan) {
      return res
        .status(404)
        .json({ success: false, message: "Laporan tidak ditemukan." });
    }
    await laporan.destroy();
    res.json({ success: true, message: "Laporan berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
