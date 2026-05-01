const Traffic = require("../models/Traffic");

const ROAD_PATHS = {
  "Jl. Gatot Subroto": [
    [3.591813, 98.66479],
    [3.5932, 98.6604],
    [3.5964, 98.6539],
    [3.5991, 98.6468],
    [3.6012, 98.6401],
  ],
  "Jl. Adam Malik": [
    [3.605004, 98.669152],
    [3.6031, 98.6711],
    [3.6004, 98.6736],
    [3.5978, 98.6768],
    [3.5952, 98.6802],
  ],
  "Jl. Diponegoro": [
    [3.576124, 98.673368],
    [3.5767, 98.6761],
    [3.5775, 98.6792],
    [3.5787, 98.6825],
    [3.5804, 98.6858],
  ],
  "Jl. Sisingamangaraja": [
    [3.580089, 98.685626],
    [3.5748, 98.6832],
    [3.5685, 98.6815],
    [3.5592, 98.6796],
    [3.5478, 98.6802],
  ],
  "Jl. Brigjen Katamso": [
    [3.5821, 98.7012],
    [3.5798, 98.7025],
    [3.5761, 98.7047],
    [3.5722, 98.707],
    [3.569, 98.7098],
  ],
  "Jl. Guru Patimpus": [
    [3.5996, 98.683],
    [3.5968, 98.6804],
    [3.5932, 98.6772],
    [3.5901, 98.6746],
    [3.5876, 98.672],
  ],
  "Jl. Yos Sudarso": [
    [3.7001, 98.6905],
    [3.686, 98.6928],
    [3.6722, 98.696],
    [3.6584, 98.6991],
    [3.6455, 98.7012],
  ],
  "Jl. Ring Road": [
    [3.57, 98.635],
    [3.5632, 98.6367],
    [3.5558, 98.6391],
    [3.5476, 98.6422],
    [3.54, 98.645],
  ],
};

exports.getAll = async (req, res) => {
  try {
    const rows = await Traffic.findAll({
      order: [
        ["status", "ASC"],
        ["nama_jalan", "ASC"],
      ],
    });
    const data = rows.map((row) => {
      const item = row.get({ plain: true });
      return {
        ...item,
        path: ROAD_PATHS[item.nama_jalan] || [
          [item.lat_start, item.lng_start],
          [item.lat_end, item.lng_end],
        ],
      };
    });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const { Op } = require("sequelize");
    const [lancar, padat, macet] = await Promise.all([
      Traffic.count({ where: { status: "Lancar" } }),
      Traffic.count({ where: { status: "Padat" } }),
      Traffic.count({ where: { status: "Macet" } }),
    ]);
    res.json({
      success: true,
      data: { lancar, padat, macet, total: lancar + padat + macet },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
