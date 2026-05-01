import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import './LayananKota.css';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#D4AF7A';
const BLUE = '#2471A3';
const PURPLE = '#8E44AD';
const RED = '#C0392B';
const INK = '#1A1A1A';

const tabs = [
  ['energi', 'Energi'],
  ['sampah', 'Sampah'],
  ['banjir', 'Banjir'],
  ['air', 'Air Bersih'],
  ['terbarukan', 'Terbarukan'],
  ['voting', 'Voting'],
  ['forum', 'Forum'],
  ['pengaduan', 'Pengaduan'],
  ['survei', 'Survei'],
  ['pengumuman', 'Pengumuman'],
];

const tooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="svc-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.name}>{item.name}: {Number(item.value).toLocaleString('id-ID')}</span>
      ))}
    </div>
  );
};

const statusClass = (status = '') => `svc-status ${status.toLowerCase().replace(/\s+/g, '-')}`;

export default function LayananKota() {
  const [active, setActive] = useState('energi');
  const [data, setData] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [floodForm, setFloodForm] = useState({ nama: '', lokasi: '', deskripsi: '', lat: '3.5896', lng: '98.6739', foto: [] });
  const [reportForm, setReportForm] = useState({ nama: '', kategori: 'Infrastruktur', deskripsi: '', foto: [] });
  const [threadForm, setThreadForm] = useState({ policy_id: '', judul: '' });
  const [commentText, setCommentText] = useState({});

  const load = async () => {
    const [overview, threadRes] = await Promise.all([
      api.get('/city-services'),
      api.get('/city-services/threads'),
    ]);
    setData(overview.data.data);
    setThreads(threadRes.data.data);
  };

  useEffect(() => {
    load().catch(() => setMessage('Gagal memuat data layanan kota.')).finally(() => setLoading(false));
  }, []);

  const energyChart = useMemo(() => {
    if (!data?.energy) return [];
    return data.energy.reduce((rows, item) => {
      const row = rows.find(r => r.bulan === item.bulan) || { bulan: item.bulan };
      row[item.zona] = item.konsumsi_mwh;
      if (!rows.includes(row)) rows.push(row);
      return rows;
    }, []);
  }, [data]);

  const zones = useMemo(() => [...new Set((data?.energy || []).map(item => item.zona))], [data]);

  const policyStats = (policy) => {
    const votes = policy.votes || [];
    const setuju = votes.filter(v => v.pilihan === 'setuju').length;
    const total = votes.length || 0;
    return {
      total,
      setuju,
      tidakSetuju: total - setuju,
      setujuPct: total ? Math.round((setuju / total) * 100) : 0,
      tidakPct: total ? Math.round(((total - setuju) / total) * 100) : 0,
    };
  };

  const refreshAfter = async (text) => {
    await load();
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const submitFlood = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('nama', floodForm.nama);
    form.append('lokasi', floodForm.lokasi);
    form.append('deskripsi', floodForm.deskripsi);
    form.append('lat', floodForm.lat);
    form.append('lng', floodForm.lng);
    floodForm.foto.forEach(file => form.append('foto', file));
    await api.post('/city-services/floods', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setFloodForm({ nama: '', lokasi: '', deskripsi: '', lat: '3.5896', lng: '98.6739', foto: [] });
    await refreshAfter('Laporan titik banjir tersimpan.');
  };

  const submitReport = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('nama', reportForm.nama);
    form.append('kategori', reportForm.kategori);
    form.append('deskripsi', reportForm.deskripsi);
    reportForm.foto.forEach(file => form.append('foto', file));
    await api.post('/city-services/reports', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setReportForm({ nama: '', kategori: 'Infrastruktur', deskripsi: '', foto: [] });
    await refreshAfter('Pengaduan warga tersimpan.');
  };

  const vote = async (policyId, pilihan) => {
    try {
      await api.post(`/city-services/policies/${policyId}/vote`, { pilihan });
      await refreshAfter('Vote berhasil direkam.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Vote gagal disimpan.');
    }
  };

  const submitThread = async (event) => {
    event.preventDefault();
    await api.post('/city-services/threads', threadForm);
    setThreadForm({ policy_id: '', judul: '' });
    await refreshAfter('Thread diskusi dibuat.');
  };

  const submitComment = async (threadId) => {
    if (!commentText[threadId]) return;
    await api.post(`/city-services/threads/${threadId}/comments`, { komentar: commentText[threadId] });
    setCommentText(prev => ({ ...prev, [threadId]: '' }));
    await refreshAfter('Komentar ditambahkan.');
  };

  if (loading) {
    return <Layout title="Layanan Kota" ><div className="svc-loading">Memuat layanan kota...</div></Layout>;
  }

  return (
    <Layout title="Layanan Kota" subtitle="Monitoring dan partisipasi warga">
      {message && <div className="svc-message">{message}</div>}

      <div className="svc-tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{label}</button>
        ))}
      </div>

      {active === 'energi' && (
        <section className="svc-panel">
          <div className="svc-panel-head">
            <h2>Monitor Konsumsi Energi</h2>
            <span>Per zona per bulan</span>
          </div>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={energyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip content={tooltip} />
              <Legend />
              {zones.map((zone, index) => (
                <Line key={zone} type="monotone" dataKey={zone} stroke={[GOLD, BLUE, GOLD_LIGHT, PURPLE][index % 4]} strokeWidth={3} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      {active === 'sampah' && (
        <section className="svc-panel">
          <div className="svc-panel-head"><h2>Tracker Sampah</h2><span>Jadwal pengangkutan per kelurahan</span></div>
          <div className="svc-grid">
            {data.waste.map(item => (
              <article className="svc-card" key={item.id}>
                <strong>{item.kelurahan}</strong>
                <p>{item.hari} · {item.jam}</p>
                <span>{item.armada} · {item.petugas}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      {active === 'banjir' && (
        <section className="svc-split">
          <form className="svc-panel svc-form" onSubmit={submitFlood}>
            <div className="svc-panel-head"><h2>Laporan Titik Banjir</h2><span>Input lokasi oleh warga</span></div>
            <input required placeholder="Nama pelapor" value={floodForm.nama} onChange={e => setFloodForm({ ...floodForm, nama: e.target.value })} />
            <input required placeholder="Lokasi" value={floodForm.lokasi} onChange={e => setFloodForm({ ...floodForm, lokasi: e.target.value })} />
            <div className="svc-two">
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#aaa' }}>Latitude (cm)</label>
                <input required type="number" step="any" placeholder="3.5896" value={floodForm.lat} onChange={e => setFloodForm({ ...floodForm, lat: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#aaa' }}>Longitude (cm)</label>
                <input required type="number" step="any" placeholder="98.6739" value={floodForm.lng} onChange={e => setFloodForm({ ...floodForm, lng: e.target.value })} />
              </div>
            </div>
            <textarea placeholder="Deskripsi kondisi" value={floodForm.deskripsi} onChange={e => setFloodForm({ ...floodForm, deskripsi: e.target.value })} />
            
            {/* Multi File Upload */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#aaa' }}>Upload Foto/Video (maks 3)</label>
              <label className="svc-primary" style={{ display: 'inline-block', cursor: 'pointer', padding: '10px 20px', borderRadius: 6 }}>
                📁 Upload
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple 
                  style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    if (floodForm.foto.length + files.length > 3) {
                      alert('Maksimal 3 file');
                      return;
                    }
                    setFloodForm({ ...floodForm, foto: [...floodForm.foto, ...files] });
                  }}
                />
              </label>
              
              {floodForm.foto.length > 0 && (
                <div style={{ 
                  marginTop: 10, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 8,
                  maxHeight: 150,
                  overflowY: 'auto',
                  padding: 8,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 6
                }}>
                  {floodForm.foto.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                      {file.type.startsWith('video/') ? (
                        <video style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setFloodForm({ ...floodForm, foto: floodForm.foto.filter((_, i) => i !== idx) })}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          cursor: 'pointer',
                          fontSize: 12,
                          lineHeight: '18px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="svc-primary">Kirim Laporan</button>
          </form>
          <div className="svc-panel">
            <div className="svc-map">
              <MapContainer center={[3.5896, 98.6739]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
                {data.floods.map(item => (
                  <CircleMarker key={item.id} center={[item.lat, item.lng]} radius={10} pathOptions={{ color: RED, fillColor: GOLD, fillOpacity: 0.8 }}>
                    <Popup><strong>{item.lokasi}</strong><br />{item.deskripsi}<br />Status: {item.status}</Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>
      )}

      {active === 'air' && (
        <section className="svc-panel">
          <div className="svc-panel-head"><h2>Status Air Bersih</h2><span>Distribusi PDAM per wilayah</span></div>
          <table className="svc-table">
            <thead><tr><th>Wilayah</th><th>Status</th><th>Debit</th><th>Tekanan</th><th>Estimasi</th></tr></thead>
            <tbody>{data.water.map(item => (
              <tr key={item.id}><td>{item.wilayah}</td><td><span className={statusClass(item.status)}>{item.status}</span></td><td>{item.debit_lps} lps</td><td>{item.tekanan_bar} bar</td><td>{item.estimasi_normal}</td></tr>
            ))}</tbody>
          </table>
        </section>
      )}

      {active === 'terbarukan' && (
        <div>
          <div className="svc-renewable-stats">
            <div className="svc-renewable-stat-card">
              <span>☀️</span>
              <div className="svc-renewable-stat-value">{data.renewable.kontribusi[0].kapasitas_mw} MW</div>
              <div className="svc-renewable-stat-label">Kapasitas Surya</div>
            </div>
            <div className="svc-renewable-stat-card">
              <span>💨</span>
              <div className="svc-renewable-stat-value">{data.renewable.kontribusi[1].kapasitas_mw} MW</div>
              <div className="svc-renewable-stat-label">Kapasitas Angin</div>
            </div>
            <div className="svc-renewable-stat-card">
              <span>⚡</span>
              <div className="svc-renewable-stat-value">
                {(data.renewable.kontribusi[0].produksi_mwh + data.renewable.kontribusi[1].produksi_mwh).toLocaleString('id-ID')} MWh
              </div>
              <div className="svc-renewable-stat-label">Total Produksi Bulan Ini</div>
            </div>
            <div className="svc-renewable-stat-card">
              <span>🌿</span>
              <div className="svc-renewable-stat-value">{data.renewable.emisi_hemat_ton.toLocaleString('id-ID')} ton</div>
              <div className="svc-renewable-stat-label">Emisi CO₂ Dihemat</div>
            </div>
          </div>

          <div className="svc-panel" style={{ marginBottom: 20 }}>
            <div className="svc-panel-head">
              <h2>Target vs Realisasi 2025</h2>
              <span>Persentase bauran energi terbarukan</span>
            </div>
            <div className="svc-renewable-progress-wrap">
              <div className="svc-renewable-progress-row">
                <span>Target</span>
                <div className="svc-renewable-bar-bg">
                  <div className="svc-renewable-bar-fill target" style={{ width: `${data.renewable.target_2025_pct}%` }} />
                </div>
                <strong>{data.renewable.target_2025_pct}%</strong>
              </div>
              <div className="svc-renewable-progress-row">
                <span>Realisasi</span>
                <div className="svc-renewable-bar-bg">
                  <div className="svc-renewable-bar-fill realisasi" style={{ width: `${data.renewable.realisasi_pct}%` }} />
                </div>
                <strong>{data.renewable.realisasi_pct}%</strong>
              </div>
            </div>
          </div>

          <div className="svc-renewable-two-col">
            <section className="svc-panel">
              <div className="svc-panel-head"><h2>Kontribusi Sumber Energi</h2><span>Proporsi surya vs angin</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={data.renewable.kontribusi} dataKey="kontribusi" nameKey="sumber" innerRadius={70} outerRadius={110} label={({ sumber, kontribusi }) => `${sumber} ${kontribusi}%`}>
                    {data.renewable.kontribusi.map((entry, index) => (
                      <Cell key={entry.sumber} fill={[GOLD, BLUE][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </section>

            <section className="svc-panel">
              <div className="svc-panel-head"><h2>Produksi per Zona</h2><span>Satuan: MWh</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.renewable.per_zona} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
                  <XAxis dataKey="zona" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip content={tooltip} />
                  <Legend />
                  <Bar dataKey="surya" name="Surya" fill={GOLD} radius={[4,4,0,0]} />
                  <Bar dataKey="angin" name="Angin" fill={BLUE} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>

          <section className="svc-panel" style={{ marginTop: 20 }}>
            <div className="svc-panel-head"><h2>Tren Produksi Bulanan</h2><span>Januari — Juni 2025 (MWh)</span></div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.renewable.tren_bulanan} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip content={tooltip} />
                <Legend />
                <Line type="monotone" dataKey="Surya" stroke={GOLD} strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Angin" stroke={BLUE} strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>
      )}

      {active === 'voting' && (
        <section className="svc-grid">
          {data.policies.map(policy => {
            const stats = policyStats(policy);
            return (
              <article className="svc-panel" key={policy.id}>
                <div className="svc-panel-head"><h2>{policy.judul}</h2><span>{policy.kategori}</span></div>
                <p>{policy.deskripsi}</p>
                <div className="svc-vote-actions">
                  <button onClick={() => vote(policy.id, 'setuju')}>Setuju</button>
                  <button onClick={() => vote(policy.id, 'tidak_setuju')}>Tidak Setuju</button>
                </div>
                <div className="svc-result"><span style={{ width: `${stats.setujuPct}%` }} /></div>
                <p className="svc-small">{stats.setujuPct}% setuju · {stats.tidakPct}% tidak setuju · {stats.total} vote</p>
              </article>
            );
          })}
        </section>
      )}

      {active === 'forum' && (
        <section className="svc-split">
          <form className="svc-panel svc-form" onSubmit={submitThread}>
            <div className="svc-panel-head"><h2>Forum Diskusi Kebijakan</h2><span>Thread per topik kebijakan</span></div>
            <select required value={threadForm.policy_id} onChange={e => setThreadForm({ ...threadForm, policy_id: e.target.value })}>
              <option value="">Pilih kebijakan</option>
              {data.policies.map(policy => <option key={policy.id} value={policy.id}>{policy.judul}</option>)}
            </select>
            <input required placeholder="Judul thread" value={threadForm.judul} onChange={e => setThreadForm({ ...threadForm, judul: e.target.value })} />
            <button className="svc-primary">Buat Thread</button>
          </form>
          <div className="svc-thread-list">
            {threads.map(thread => (
              <article className="svc-panel" key={thread.id}>
                <div className="svc-panel-head"><h2>{thread.judul}</h2><span>{thread.policy?.judul}</span></div>
                {(thread.comments || []).map(comment => <p className="svc-comment" key={comment.id}><strong>{comment.nama}</strong> {comment.komentar}</p>)}
                <div className="svc-inline">
                  <input placeholder="Tulis komentar" value={commentText[thread.id] || ''} onChange={e => setCommentText({ ...commentText, [thread.id]: e.target.value })} />
                  <button onClick={() => submitComment(thread.id)}>Kirim</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {active === 'pengaduan' && (
        <section className="svc-split">
          <form className="svc-panel svc-form" onSubmit={submitReport}>
            <div className="svc-panel-head"><h2>Pengaduan Warga</h2><span>Form laporan dengan foto</span></div>
            <input required placeholder="Nama" value={reportForm.nama} onChange={e => setReportForm({ ...reportForm, nama: e.target.value })} />
            <select value={reportForm.kategori} onChange={e => setReportForm({ ...reportForm, kategori: e.target.value })}>
              <option>Infrastruktur</option><option>Keamanan</option><option>Kebersihan</option><option>Pelayanan Publik</option>
            </select>
            <textarea required placeholder="Deskripsi laporan" value={reportForm.deskripsi} onChange={e => setReportForm({ ...reportForm, deskripsi: e.target.value })} />
            
            {/* Multi File Upload */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#aaa' }}>Upload Foto/Video (maks 3)</label>
              <label className="svc-primary" style={{ display: 'inline-block', cursor: 'pointer', padding: '10px 20px', borderRadius: 6 }}>
                📁 Upload
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple 
                  style={{ display: 'none' }}
                  onChange={e => {
                    const files = Array.from(e.target.files);
                    if (reportForm.foto.length + files.length > 3) {
                      alert('Maksimal 3 file');
                      return;
                    }
                    setReportForm({ ...reportForm, foto: [...reportForm.foto, ...files] });
                  }}
                />
              </label>
              
              {reportForm.foto.length > 0 && (
                <div style={{ 
                  marginTop: 10, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 8,
                  maxHeight: 150,
                  overflowY: 'auto',
                  padding: 8,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 6
                }}>
                  {reportForm.foto.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', width: 80, height: 80 }}>
                      {file.type.startsWith('video/') ? (
                        <video style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={file.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setReportForm({ ...reportForm, foto: reportForm.foto.filter((_, i) => i !== idx) })}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          cursor: 'pointer',
                          fontSize: 12,
                          lineHeight: '18px'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="svc-primary">Kirim Pengaduan</button>
          </form>
          <div className="svc-panel">
            <table className="svc-table">
              <thead><tr><th>Nama</th><th>Kategori</th><th>Status</th></tr></thead>
              <tbody>{data.reports.map(item => <tr key={item.id}><td>{item.nama}</td><td>{item.kategori}</td><td><span className={statusClass(item.status)}>{item.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      {active === 'survei' && (
        <section className="svc-panel">
          <div className="svc-panel-head"><h2>Survei Kepuasan Layanan</h2><span>Hasil berkala dalam chart</span></div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={data.surveys}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="layanan" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={tooltip} />
              <Bar dataKey="skor" name="Skor" fill={GOLD} radius={[6, 6, 0, 0]} />
              <Bar dataKey="responden" name="Responden" fill={BLUE} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {active === 'pengumuman' && (
        <section className="svc-grid">
          {data.announcements.map(item => (
            <article className="svc-card svc-announcement" key={item.id}>
              <span>{item.kategori} · {item.tanggal}</span>
              <strong>{item.judul}</strong>
              <p>{item.isi}</p>
            </article>
          ))}
        </section>
      )}
    </Layout>
  );
}
