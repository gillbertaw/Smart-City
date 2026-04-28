const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: Number, default: null },
  nama: { type: String, default: 'Guest' },
  aksi: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'REGISTER', 'VOTE', 'SUBMIT_LAPORAN',
           'TAMBAH_KEBIJAKAN', 'UPDATE_LAPORAN', 'TAMBAH_PENGUMUMAN',
           'EDIT_PENGUMUMAN', 'HAPUS_PENGUMUMAN', 'EDIT_KEBIJAKAN',
           'HAPUS_KEBIJAKAN', 'UPDATE_MASTER', 'TOGGLE_ALERT',
           'EDIT_PROFIL', 'FORGOT_PASSWORD']
  },
  detail: { type: String, default: '' },
  ipAddress: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
