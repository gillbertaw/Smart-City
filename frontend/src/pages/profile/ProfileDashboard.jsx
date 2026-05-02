import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import '../auth/auth.css';

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();
  const [profil, setProfil] = useState(null);
  const [statistik, setStatistik] = useState({ totalVote: 0, totalLaporan: 0, totalLogin: 0 });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nama: '', kota: '' });
  const [fotoFile, setFotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfil();
    fetchStatistik();
  }, []);

  const fetchProfil = async () => {
    try {
      const res = await api.get('/users/profil');
      setProfil(res.data);
      setForm({ nama: res.data.nama, kota: res.data.kota });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistik = async () => {
    try {
      const res = await api.get('/users/statistik');
      setStatistik(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('kota', form.kota);
      if (fotoFile) formData.append('foto_profil', fotoFile);

      const res = await fetch('/api/users/profil', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProfil({ ...profil, ...data.user });
      login(data.user, token);
      setEditMode(false);
      setMsg({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Gagal update profil.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-light)' }}>
      Memuat profil...
    </div>
  );

  return (
    <div className="profile-page">
      {/* Tombol Back */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          background: 'transparent',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        ← Kembali
      </button>

      {/* HEADER PROFIL */}
      <div className="profile-header">
        {profil?.foto_profil
          ? <img src={profil.foto_profil} alt="foto" className="profile-avatar" />
          : <div className="profile-avatar-placeholder">
              {profil?.nama?.charAt(0).toUpperCase()}
            </div>
        }
        <div className="profile-info">
          <h2>{profil?.nama}</h2>
          <p>{profil?.email}</p>
          <p>📍 {profil?.kota}</p>
          <span className="profile-badge">
            {profil?.role === 'admin' ? '⭐ Admin Kota' : '🏠 Warga'}
          </span>
        </div>
        <button className="btn btn-outline" style={{ marginLeft: 'auto', color: 'var(--gold)', borderColor: 'var(--gold)', position: 'relative', zIndex : 1 }}
          onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Batal' : '✏️ Edit Profil'}
        </button>
      </div>

      {/* STATISTIK */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-num">{statistik.totalVote}</div>
          <div className="stat-label">Total Voting</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{statistik.totalLaporan}</div>
          <div className="stat-label">Laporan Dikirim</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{statistik.totalLogin}</div>
          <div className="stat-label">Total Login</div>
        </div>
      </div>

      <div className="profile-grid">

        {/* EDIT / INFO PROFIL */}
        <div className="section-card">
          <div className="section-card-header">
            <h3>{editMode ? '✏️ Edit Profil' : '👤 Informasi Profil'}</h3>
          </div>
          <div className="section-card-body">
            {msg.text && (
              <div className={msg.type === 'success' ? 'success-msg' : 'error-msg'}>
                {msg.text}
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input value={form.nama}
                    onChange={e => setForm({ ...form, nama: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <input value={form.kota}
                    onChange={e => setForm({ ...form, kota: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Foto Profil</label>
                  <input type="file" accept="image/*"
                    onChange={e => setFotoFile(e.target.files[0])} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Nama', value: profil?.nama },
                  { label: 'Email', value: profil?.email },
                  { label: 'Kota', value: profil?.kota },
                  { label: 'Role', value: profil?.role === 'admin' ? 'Admin Kota' : 'Warga' },
                  { label: 'Bergabung', value: new Date(profil?.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between',
                    padding: '10px 0', borderBottom: '1px solid var(--light-gray)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-light)' }}>{item.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RINGKASAN AKTIVITAS */}
        <div className="section-card">
          <div className="section-card-header">
            <h3>📊 Ringkasan Aktivitas</h3>
          </div>
          <div className="section-card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: '🗳️ Voting Kebijakan', value: statistik.totalVote, color: '#C9A84C' },
                { label: '📋 Laporan Pengaduan', value: statistik.totalLaporan, color: '#2E5496' },
                { label: '🔐 Total Login', value: statistik.totalLogin, color: '#2471A3' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '12px 16px',
                  background: 'var(--off-white)', borderRadius: 'var(--radius)',
                  borderLeft: `4px solid ${item.color}` }}>
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, fontSize: 18, color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="empty-state" style={{ marginTop: 16 }}>
              <p style={{ fontSize: 13 }}>Riwayat detail voting dan laporan<br />akan tampil di halaman masing-masing fitur.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
