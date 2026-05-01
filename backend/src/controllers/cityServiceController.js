const {
  EnergyConsumption,
  WasteSchedule,
  FloodReport,
  WaterStatus,
  WaterDistribution,
  Policy,
  PolicyVote,
  PolicyThread,
  PolicyComment,
  CitizenReport,
  ServiceSurvey,
  Announcement,
  AnnouncementComment,
  AnnouncementCommentReaction,
} = require("../models/CityService");
const { Op } = require("sequelize");
const Log = require("../models/Log");

const renewableMix = {
  kontribusi: [
    {
      sumber: "Surya",
      kontribusi: 62,
      kapasitas_mw: 48,
      produksi_mwh: 1240,
      panel_unit: 320,
    },
    {
      sumber: "Angin",
      kontribusi: 38,
      kapasitas_mw: 29,
      produksi_mwh: 760,
      panel_unit: 18,
    },
  ],
  tren_bulanan: [
    { bulan: "Jan", Surya: 980, Angin: 610 },
    { bulan: "Feb", Surya: 1050, Angin: 580 },
    { bulan: "Mar", Surya: 1120, Angin: 640 },
    { bulan: "Apr", Surya: 1200, Angin: 700 },
    { bulan: "Mei", Surya: 1240, Angin: 760 },
    { bulan: "Jun", Surya: 1180, Angin: 720 },
  ],
  per_zona: [
    { zona: "Pusat Kota", surya: 380, angin: 210 },
    { zona: "Medan Utara", surya: 290, angin: 180 },
    { zona: "Medan Selatan", surya: 340, angin: 220 },
    { zona: "Medan Barat", surya: 230, angin: 150 },
  ],
  emisi_hemat_ton: 1840,
  target_2025_pct: 68,
  realisasi_pct: 62,
};

const seedIfEmpty = async () => {
  if (await EnergyConsumption.count()) return;
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
  const zona = ["Pusat Kota", "Medan Utara", "Medan Selatan", "Medan Barat"];
  await EnergyConsumption.bulkCreate(
    zona.flatMap((z, zi) =>
      bulan.map((b, i) => ({
        zona: z,
        bulan: b,
        tahun: 2024,
        konsumsi_mwh: 820 + zi * 95 + i * 34 + (i % 2) * 48,
      })),
    ),
  );
  await WasteSchedule.bulkCreate([
    {
      kelurahan: "Kesawan",
      hari: "Senin, Kamis",
      jam: "06:00",
      armada: "TR-01",
      petugas: "Tim Inti Barat",
    },
    {
      kelurahan: "Petisah Tengah",
      hari: "Selasa, Jumat",
      jam: "07:00",
      armada: "TR-03",
      petugas: "Tim Petisah",
    },
    {
      kelurahan: "Titi Rantai",
      hari: "Rabu, Sabtu",
      jam: "06:30",
      armada: "TR-05",
      petugas: "Tim Selatan",
    },
    {
      kelurahan: "Belawan Bahagia",
      hari: "Senin, Rabu, Jumat",
      jam: "08:00",
      armada: "TR-09",
      petugas: "Tim Utara",
    },
  ]);
  await FloodReport.bulkCreate([
    {
      nama: "Warga Medan Baru",
      lokasi: "Jl. Dr. Mansyur",
      deskripsi: "Genangan setinggi trotoar setelah hujan deras.",
      lat: 3.5688,
      lng: 98.6539,
      status: "proses",
    },
    {
      nama: "Warga Medan Denai",
      lokasi: "Jl. Denai",
      deskripsi: "Air menutup separuh badan jalan.",
      lat: 3.566,
      lng: 98.7116,
      status: "pending",
    },
  ]);
  await WaterStatus.bulkCreate([
    {
      wilayah: "Medan Kota",
      status: "Normal",
      debit_lps: 142,
      tekanan_bar: 2.6,
      estimasi_normal: "Aktif",
    },
    {
      wilayah: "Medan Helvetia",
      status: "Pemeliharaan",
      debit_lps: 81,
      tekanan_bar: 1.4,
      estimasi_normal: "18:00 WIB",
    },
    {
      wilayah: "Medan Belawan",
      status: "Gangguan",
      debit_lps: 54,
      tekanan_bar: 0.9,
      estimasi_normal: "22:00 WIB",
    },
    {
      wilayah: "Medan Johor",
      status: "Normal",
      debit_lps: 121,
      tekanan_bar: 2.2,
      estimasi_normal: "Aktif",
    },
  ]);
  const policies = await Policy.bulkCreate([
    {
      judul: "Zona Rendah Emisi Pusat Kota",
      kategori: "Transportasi",
      deskripsi:
        "Pembatasan kendaraan emisi tinggi pada jam sibuk di area inti kota.",
    },
    {
      judul: "Insentif Panel Surya Rumah Tangga",
      kategori: "Energi",
      deskripsi:
        "Subsidi instalasi panel surya untuk pelanggan rumah tangga prioritas.",
    },
    {
      judul: "Pembangunan MRT Medan Raya",
      kategori: "Transportasi",
      deskripsi:
        "Pembangunan jalur MRT untuk memudahkan mobilitas masyarakat, mengurangi kemacetan, dan menghubungkan pusat kota dengan kawasan permukiman serta pusat ekonomi.",
    },
    {
      judul: "Digitalisasi Layanan Administrasi Warga",
      kategori: "Layanan Publik",
      deskripsi:
        "Pengajuan surat, pengaduan, dan layanan administrasi kota dilakukan secara online agar warga tidak perlu antre lama di kantor layanan.",
    },
    {
      judul: "Revitalisasi Trotoar dan Jalur Sepeda",
      kategori: "Infrastruktur",
      deskripsi:
        "Perbaikan trotoar, penambahan jalur sepeda, dan akses ramah disabilitas di koridor sekolah, pasar, dan pusat perkantoran.",
    },
    {
      judul: "Program Bank Sampah Kelurahan",
      kategori: "Lingkungan",
      deskripsi:
        "Setiap kelurahan memiliki bank sampah terintegrasi untuk mendorong pemilahan sampah rumah tangga dan memberi insentif bagi warga.",
    },
    {
      judul: "Internet Publik di Ruang Kota",
      kategori: "Teknologi",
      deskripsi:
        "Penyediaan Wi-Fi publik di taman, halte, perpustakaan, dan kantor layanan untuk memperluas akses informasi masyarakat.",
    },
    {
      judul: "Prioritas Drainase Wilayah Rawan Banjir",
      kategori: "Lingkungan",
      deskripsi:
        "Normalisasi drainase dan sensor tinggi air diprioritaskan di titik rawan banjir agar respons petugas lebih cepat.",
    },
  ]);
  const threads = await PolicyThread.bulkCreate([
    {
      policy_id: policies[0].id,
      judul: "Dampak ke UMKM pusat kota",
      dibuat_oleh: "Admin Kota",
    },
    {
      policy_id: policies[1].id,
      judul: "Prioritas penerima subsidi",
      dibuat_oleh: "Admin Kota",
    },
  ]);
  await PolicyComment.bulkCreate([
    {
      thread_id: threads[0].id,
      nama: "Sari",
      komentar: "Perlu jalur distribusi barang yang tetap mudah diakses.",
    },
    {
      thread_id: threads[1].id,
      nama: "Bima",
      komentar: "Prioritaskan wilayah dengan konsumsi listrik tinggi.",
    },
  ]);
  await CitizenReport.bulkCreate([
    {
      nama: "Andi",
      kategori: "Jalan Rusak",
      deskripsi: "Lubang besar dekat persimpangan.",
      status: "proses",
    },
    {
      nama: "Maya",
      kategori: "Lampu Jalan",
      deskripsi: "Lampu padam tiga malam berturut-turut.",
      status: "pending",
    },
    {
      nama: "William",
      kategori: "Balap liar",
      deskripsi:
        "Balap liar mengganggu keamanan dan kenyamanan warga pada malam hari.",
      status: "selesai",
    },
  ]);
  await Announcement.bulkCreate([
    {
      judul: "Pemeliharaan Jaringan PDAM",
      kategori: "Air Bersih",
      tanggal: "2026-04-25",
      isi: "Pemeliharaan dilakukan bertahap di Medan Helvetia dan sekitarnya.",
    },
    {
      judul: "Uji Coba Jalur Rendah Emisi",
      kategori: "Kebijakan",
      tanggal: "2026-04-01",
      isi: "Uji coba berlaku pukul 07:00 sampai 10:00 di koridor pusat kota.",
    },
    {
      judul: "Penutupan beberapa jalan Kota Medan 2026",
      kategori: "Acara",
      tanggal: "2026-05-01",
      isi: "Antisipasi untuk demo buruh.",
    },
    {
      judul: "Program Makan Bergizi Gratis",
      kategori: "Pendidikan",
      tanggal: "2026-08-01",
      isi: "Presiden Indonesia mengadakan Program MBG untuk seluruh wilyah di Indonesia untuk menjaga kebutuhan gizi siswa siswi.",
    },
  ]);
};

const seedWaterDistribution = async () => {
  if (await WaterDistribution.count()) return;
  await WaterDistribution.bulkCreate([
    {
      wilayah: "Medan Kota",
      kecamatan: "Medan Kota",
      pelanggan_aktif: 12450,
      kapasitas_lps: 180,
      distribusi_lps: 142,
      kehilangan_pct: 8.2,
      status_pipa: "Baik",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Helvetia",
      kecamatan: "Medan Helvetia",
      pelanggan_aktif: 9870,
      kapasitas_lps: 120,
      distribusi_lps: 81,
      kehilangan_pct: 15.4,
      status_pipa: "Perlu Perawatan",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Belawan",
      kecamatan: "Medan Belawan",
      pelanggan_aktif: 7320,
      kapasitas_lps: 95,
      distribusi_lps: 54,
      kehilangan_pct: 24.1,
      status_pipa: "Kritis",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Johor",
      kecamatan: "Medan Johor",
      pelanggan_aktif: 10540,
      kapasitas_lps: 150,
      distribusi_lps: 121,
      kehilangan_pct: 9.8,
      status_pipa: "Baik",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Sunggal",
      kecamatan: "Medan Sunggal",
      pelanggan_aktif: 8910,
      kapasitas_lps: 130,
      distribusi_lps: 104,
      kehilangan_pct: 11.3,
      status_pipa: "Baik",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Amplas",
      kecamatan: "Medan Amplas",
      pelanggan_aktif: 6780,
      kapasitas_lps: 100,
      distribusi_lps: 72,
      kehilangan_pct: 18.7,
      status_pipa: "Perlu Perawatan",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Marelan",
      kecamatan: "Medan Marelan",
      pelanggan_aktif: 5430,
      kapasitas_lps: 80,
      distribusi_lps: 58,
      kehilangan_pct: 21.5,
      status_pipa: "Kritis",
      update_terakhir: "01 Mei 2025, 06:00",
    },
    {
      wilayah: "Medan Tembung",
      kecamatan: "Medan Tembung",
      pelanggan_aktif: 8120,
      kapasitas_lps: 115,
      distribusi_lps: 96,
      kehilangan_pct: 10.1,
      status_pipa: "Baik",
      update_terakhir: "01 Mei 2025, 06:00",
    },
  ]);
};

const seedServiceSurvey = async () => {
  const sudahLengkap = await ServiceSurvey.findOne({
    where: { periode: "Q4" },
  });
  if (sudahLengkap) return;
  await ServiceSurvey.bulkCreate([
    { layanan: "Transportasi", periode: "Q1", skor: 72, responden: 380 },
    { layanan: "Air Bersih", periode: "Q1", skor: 68, responden: 340 },
    { layanan: "Kebersihan", periode: "Q1", skor: 70, responden: 360 },
    { layanan: "Pengaduan", periode: "Q1", skor: 65, responden: 290 },
    { layanan: "Kesehatan", periode: "Q1", skor: 74, responden: 410 },
    { layanan: "Pendidikan", periode: "Q1", skor: 76, responden: 390 },

    { layanan: "Transportasi", periode: "Q2", skor: 75, responden: 400 },
    { layanan: "Air Bersih", periode: "Q2", skor: 71, responden: 360 },
    { layanan: "Kebersihan", periode: "Q2", skor: 73, responden: 380 },
    { layanan: "Pengaduan", periode: "Q2", skor: 68, responden: 310 },
    { layanan: "Kesehatan", periode: "Q2", skor: 77, responden: 430 },
    { layanan: "Pendidikan", periode: "Q2", skor: 78, responden: 410 },

    { layanan: "Transportasi", periode: "Q3", skor: 78, responden: 420 },
    { layanan: "Air Bersih", periode: "Q3", skor: 74, responden: 390 },
    { layanan: "Kebersihan", periode: "Q3", skor: 76, responden: 405 },
    { layanan: "Pengaduan", periode: "Q3", skor: 71, responden: 330 },
    { layanan: "Kesehatan", periode: "Q3", skor: 80, responden: 450 },
    { layanan: "Pendidikan", periode: "Q3", skor: 81, responden: 430 },

    { layanan: "Transportasi", periode: "Q4", skor: 80, responden: 440 },
    { layanan: "Air Bersih", periode: "Q4", skor: 76, responden: 410 },
    { layanan: "Kebersihan", periode: "Q4", skor: 79, responden: 420 },
    { layanan: "Pengaduan", periode: "Q4", skor: 74, responden: 350 },
    { layanan: "Kesehatan", periode: "Q4", skor: 83, responden: 470 },
    { layanan: "Pendidikan", periode: "Q4", skor: 84, responden: 450 },
  ]);
};

exports.seedIfEmpty = seedIfEmpty;

const ok = (res, data) => res.json({ success: true, data });
const fail = (res, err) =>
  res.status(500).json({ success: false, message: err.message });

exports.overview = async (req, res) => {
  try {
    await seedIfEmpty();
    await seedServiceSurvey();
    const [
      energy,
      waste,
      floods,
      water,
      policies,
      reports,
      surveys,
      announcements,
    ] = await Promise.all([
      EnergyConsumption.findAll({
        order: [
          ["zona", "ASC"],
          ["id", "ASC"],
        ],
      }),
      WasteSchedule.findAll({ order: [["kelurahan", "ASC"]] }),
      FloodReport.findAll({
        where: { status: { [Op.ne]: "selesai" } },
        order: [["createdAt", "DESC"]],
      }),
      WaterStatus.findAll({ order: [["wilayah", "ASC"]] }),
      Policy.findAll({
        include: [{ model: PolicyVote, as: "votes" }],
        order: [["createdAt", "DESC"]],
      }),
      CitizenReport.findAll({ order: [["createdAt", "DESC"]] }),
      ServiceSurvey.findAll({ order: [["layanan", "ASC"]] }),
      Announcement.findAll({ order: [["tanggal", "DESC"]] }),
    ]);
    ok(res, {
      energy,
      waste,
      floods,
      water,
      renewable: renewableMix,
      policies,
      reports,
      surveys,
      announcements,
    });
  } catch (err) {
    fail(res, err);
  }
};

exports.createFlood = async (req, res) => {
  try {
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const row = await FloodReport.create({
      ...req.body,
      foto,
      lat: Number(req.body.lat),
      lng: Number(req.body.lng),
    });
    await Log.create({
      userId: req.user.id,
      nama: req.user.nama || req.body.nama || "Warga",
      aksi: "SUBMIT_LAPORAN",
      detail: `Laporan titik banjir di ${req.body.lokasi}`,
      ipAddress: req.ip,
    });
    ok(res, row);
  } catch (err) {
    fail(res, err);
  }
};

exports.votePolicy = async (req, res) => {
  try {
    const userId = req.user.id;
    const policyId = Number(req.params.id);
    const existing = await PolicyVote.findOne({
      where: { policy_id: policyId, user_id: userId },
    });
    if (existing)
      return res
        .status(409)
        .json({
          success: false,
          message: "Anda sudah pernah vote untuk kebijakan ini.",
        });
    await PolicyVote.create({
      policy_id: policyId,
      user_id: userId,
      pilihan: req.body.pilihan,
    });
    await Log.create({
      userId,
      nama: req.user.nama || "Warga",
      aksi: "VOTE",
      detail: `Vote ${req.body.pilihan} untuk kebijakan #${policyId}`,
      ipAddress: req.ip,
    });
    const votes = await PolicyVote.findAll({ where: { policy_id: policyId } });
    const setuju = votes.filter((v) => v.pilihan === "setuju").length;
    ok(res, {
      total: votes.length,
      setuju,
      tidak_setuju: votes.length - setuju,
    });
  } catch (err) {
    fail(res, err);
  }
};

exports.threads = async (req, res) => {
  try {
    await seedIfEmpty();
    const where = req.query.policy_id ? { policy_id: req.query.policy_id } : {};
    const data = await PolicyThread.findAll({
      where,
      include: [
        { model: PolicyComment, as: "comments" },
        { model: Policy, as: "policy" },
      ],
      order: [["createdAt", "DESC"]],
    });
    ok(res, data);
  } catch (err) {
    fail(res, err);
  }
};

exports.createThread = async (req, res) => {
  try {
    const row = await PolicyThread.create({
      ...req.body,
      dibuat_oleh: req.user.nama || "Warga",
    });
    ok(res, row);
  } catch (err) {
    fail(res, err);
  }
};

exports.createComment = async (req, res) => {
  try {
    const row = await PolicyComment.create({
      thread_id: Number(req.params.id),
      user_id: req.user.id,
      nama: req.user.nama || "Warga",
      komentar: req.body.komentar,
    });
    ok(res, row);
  } catch (err) {
    fail(res, err);
  }
};

exports.createReport = async (req, res) => {
  try {
    const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const row = await CitizenReport.create({ ...req.body, foto });
    await Log.create({
      userId: req.user.id,
      nama: req.user.nama || req.body.nama || "Warga",
      aksi: "SUBMIT_LAPORAN",
      detail: `Laporan warga kategori ${req.body.kategori}`,
      ipAddress: req.ip,
    });
    ok(res, row);
  } catch (err) {
    fail(res, err);
  }
};

exports.waterDetail = async (req, res) => {
  try {
    await seedIfEmpty();
    await seedWaterDistribution();
    const [statuses, distributions] = await Promise.all([
      WaterStatus.findAll({ order: [["wilayah", "ASC"]] }),
      WaterDistribution.findAll({ order: [["wilayah", "ASC"]] }),
    ]);
    ok(res, { statuses, distributions });
  } catch (err) {
    fail(res, err);
  }
};

exports.getAnnouncementComments = async (req, res) => {
  try {
    const comments = await AnnouncementComment.findAll({
      where: { announcement_id: req.params.id },
      include: [{ model: AnnouncementCommentReaction, as: "reactions" }],
      order: [["createdAt", "ASC"]],
    });
    ok(res, comments);
  } catch (err) {
    fail(res, err);
  }
};

exports.createAnnouncementComment = async (req, res) => {
  try {
    const comment = await AnnouncementComment.create({
      announcement_id: Number(req.params.id),
      user_id: req.user.id,
      nama: req.user.nama || "Warga",
      komentar: req.body.komentar,
    });
    ok(res, comment);
  } catch (err) {
    fail(res, err);
  }
};

exports.reactComment = async (req, res) => {
  try {
    const comment_id = Number(req.params.commentId);
    const user_id = req.user.id;
    const { reaksi } = req.body;
    const existing = await AnnouncementCommentReaction.findOne({
      where: { comment_id, user_id },
    });
    if (existing) {
      if (existing.reaksi === reaksi) {
        await existing.destroy();
        return ok(res, { message: "Reaksi dibatalkan" });
      }
      await existing.update({ reaksi });
      return ok(res, { message: "Reaksi diubah" });
    }
    const reaction = await AnnouncementCommentReaction.create({
      comment_id,
      user_id,
      reaksi,
    });
    ok(res, reaction);
  } catch (err) {
    fail(res, err);
  }
};
