import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './LayananPublik.css';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#D4AF7A';
const NAVY = '#0A1628';
const BLUE = '#2471A3';
const RED = '#C0392B';
const PURPLE = '#8E44AD';

const tabs = [
  ['rs', 'Rumah Sakit'],
  ['cctv', 'CCTV'],
  ['alert', 'Alert'],
  ['health', 'Kesehatan'],
  ['edu', 'Pendidikan'],
  ['jobs', 'Lowongan'],
  ['umkm', 'UMKM'],
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="pub-tooltip">
      <strong>{label}</strong>
      {payload.map(item => <span key={item.name}>{item.name}: {Number(item.value).toLocaleString('id-ID')}</span>)}
    </div>
  );
};

export default function LayananPublik() {
  const { user } = useAuth();
  const [active, setActive] = useState('rs');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/public-services');
    setData(res.data.data);
  };

  useEffect(() => {
    load().catch(() => setMessage('Gagal memuat data layanan publik.')).finally(() => setLoading(false));
  }, []);

  const healthByPeriod = useMemo(() => {
    if (!data?.health) return [];
    return data.health.map(item => ({
      periode: item.periode,
      kasus: item.kasus,
      vaksinasi: item.vaksinasi,
      penyakit: item.penyakit,
    }));
  }, [data]);

  const umkmStats = useMemo(() => {
    if (!data?.umkm) return [];
    const grouped = data.umkm.reduce((acc, item) => {
      const row = acc[item.kategori] || { kategori: item.kategori, omzet: 0, tenaga_kerja: 0, jumlah: 0 };
      row.omzet += item.omzet_bulanan;
      row.tenaga_kerja += item.tenaga_kerja;
      row.jumlah += 1;
      acc[item.kategori] = row;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [data]);

  const activeAlerts = data?.alerts?.filter(alert => alert.aktif) || [];

  const toggleAlert = async (alert) => {
    try {
      await api.patch(`/public-services/alerts/${alert.id}`, { aktif: !alert.aktif });
      await load();
      setMessage('Status alert diperbarui.');
      window.setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Hanya admin yang bisa mengubah alert.');
    }
  };

  if (loading) {
    return <Layout title="Layanan Publik" subtitle="Kesehatan, keamanan, pendidikan, kerja, dan UMKM"><div className="pub-loading">Memuat data...</div></Layout>;
  }

  return (
    <Layout title="Layanan Publik" subtitle="Fitur Smart City 16 sampai 22">
      {activeAlerts.map(alert => (
        <div className={`pub-alert ${alert.tingkat.toLowerCase()}`} key={alert.id}>
          <strong>{alert.tingkat}: {alert.judul}</strong>
          <span>{alert.pesan}</span>
        </div>
      ))}
      {message && <div className="pub-message">{message}</div>}

      <div className="pub-tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{label}</button>
        ))}
      </div>

      {active === 'rs' && (
        <section className="pub-split">
          <div className="pub-panel">
            <div className="pub-head"><h2>Info Kapasitas Rumah Sakit</h2><span>Bed tersedia dan status layanan</span></div>
            <div className="pub-list">
              {data.hospitals.map(rs => (
                <article className="pub-card" key={rs.id}>
                  <div>
                    <strong>{rs.nama}</strong>
                    <p>{rs.alamat}</p>
                  </div>
                  <span className={`pub-status ${rs.status.toLowerCase()}`}>{rs.bed_tersedia}/{rs.bed_total} bed · {rs.status}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="pub-panel">
            <MapBox points={data.hospitals} type="hospital" />
          </div>
        </section>
      )}

      {active === 'cctv' && (
        <section className="pub-split">
          <div className="pub-panel">
            <div className="pub-head"><h2>Peta Titik CCTV & Zona Aman</h2><span>Sebaran kamera pengawasan kota</span></div>
            <div className="pub-list">
              {data.cctv.map(item => (
                <article className="pub-card" key={item.id}>
                  <strong>{item.nama}</strong>
                  <p>{item.lokasi}</p>
                  <span>{item.zona} · {item.status}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="pub-panel">
            <MapBox points={data.cctv} type="cctv" showZones />
          </div>
        </section>
      )}

      {active === 'alert' && (
        <section className="pub-grid">
          {data.alerts.map(alert => (
            <article className="pub-panel" key={alert.id}>
              <div className="pub-head"><h2>{alert.judul}</h2><span>{alert.tingkat}</span></div>
              <p>{alert.pesan}</p>
              <span className={`pub-status ${alert.aktif ? 'aktif' : 'nonaktif'}`}>{alert.aktif ? 'Aktif' : 'Nonaktif'}</span>
              {user?.role === 'admin' && <button className="pub-primary" onClick={() => toggleAlert(alert)}>{alert.aktif ? 'Nonaktifkan' : 'Aktifkan'}</button>}
            </article>
          ))}
        </section>
      )}

      {active === 'health' && (
        <section className="pub-panel">
          <div className="pub-head"><h2>Statistik Kesehatan Kota</h2><span>Penyakit dan vaksinasi per periode</span></div>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={healthByPeriod}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="periode" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="kasus" name="Kasus Penyakit" fill={RED} radius={[6, 6, 0, 0]} />
              <Bar dataKey="vaksinasi" name="Vaksinasi" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="pub-chip-row">
            {data.health.map(item => <span key={item.id}>{item.periode}: {item.penyakit}</span>)}
          </div>
        </section>
      )}

      {active === 'edu' && (
        <section className="pub-split">
          <div className="pub-panel">
            <div className="pub-head"><h2>Direktori Sekolah & Universitas</h2><span>Institusi pendidikan dan lokasi</span></div>
            <div className="pub-list">
              {data.education.map(item => (
                <article className="pub-card" key={item.id}>
                  <strong>{item.nama}</strong>
                  <p>{item.alamat}</p>
                  <span>{item.jenis} · Akreditasi {item.akreditasi} · {Number(item.jumlah_siswa).toLocaleString('id-ID')} peserta didik</span>
                </article>
              ))}
            </div>
          </div>
          <div className="pub-panel"><MapBox points={data.education} type="education" /></div>
        </section>
      )}

      {active === 'jobs' && (
        <section className="pub-grid">
          {data.jobs.map(job => (
            <article className="pub-card pub-job" key={job.id}>
              <span>{job.lokasi} · {job.tipe}</span>
              <strong>{job.posisi}</strong>
              <p>{job.perusahaan}</p>
              <p>{job.deskripsi}</p>
              <div className="pub-job-foot"><span>{job.gaji}</span><span>Deadline {job.deadline}</span></div>
            </article>
          ))}
        </section>
      )}

      {active === 'umkm' && (
        <section className="pub-split wide">
          <div className="pub-panel">
            <div className="pub-head"><h2>Data UMKM & Ekonomi Lokal</h2><span>Sebaran usaha dan statistik ekonomi</span></div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={umkmStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
                <XAxis dataKey="kategori" />
                <YAxis tickFormatter={value => `${value / 1000000} jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="omzet" name="Omzet Bulanan" stroke={GOLD} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={umkmStats} dataKey="jumlah" nameKey="kategori" outerRadius={80} label>
                  {umkmStats.map((item, index) => <Cell key={item.kategori} fill={[GOLD, BLUE, PURPLE, GOLD_LIGHT][index % 4]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="pub-panel"><MapBox points={data.umkm} type="umkm" /></div>
        </section>
      )}
    </Layout>
  );
}

function MapBox({ points, type, showZones = false }) {
  return (
    <div className="pub-map">
      <MapContainer center={[3.5896, 98.6739]} zoom={12} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
        {showZones && (
          <>
            <Circle center={[3.5908, 98.6693]} radius={900} pathOptions={{ color: GOLD, fillColor: GOLD, fillOpacity: 0.12 }} />
            <Circle center={[3.5700, 98.6350]} radius={1000} pathOptions={{ color: BLUE, fillColor: BLUE, fillOpacity: 0.10 }} />
          </>
        )}
        {points.map(point => (
          <Marker key={`${type}-${point.id}`} position={[point.lat, point.lng]}>
            <Popup>
              <strong>{point.nama}</strong><br />
              {point.alamat || point.lokasi}<br />
              {point.status || point.kategori || point.jenis}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
