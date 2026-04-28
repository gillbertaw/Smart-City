import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './Dashboard.css';

const GOLD = '#C9A84C';
const NAVY = '#0A1628';
const GOLD2 = '#D4AF7A';

const StatCard = ({ icon, label, value, unit, sub, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '15', color }}>{icon}</div>
    <div className="stat-body">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}<span className="stat-unit">{unit}</span></div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: NAVY, padding: '10px 14px', borderRadius: 8, border: `1px solid ${GOLD}22` }}>
        <p style={{ color: GOLD, fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: '#fff', fontSize: 12 }}>
            {p.name}: <strong style={{ color: GOLD2 }}>{Number(p.value).toLocaleString('id-ID')}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardKota() {
  const [stats, setStats] = useState([]);
  const [summary, setSummary] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, o] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/overview'),
        ]);
        setStats(s.data.data.chart);
        setSummary(s.data.data.summary);
        setOverview(o.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <Layout title="Dashboard Kota" subtitle="Statistik & Monitoring Smart City Medan">
      <div className="loading-state">⏳ Memuat data dashboard...</div>
    </Layout>
  );

  return (
    <Layout title="Dashboard Kota" subtitle="Statistik & Monitoring Smart City Medan">
      {/* Quick Stats */}
      <div className="stats-grid">
        <StatCard icon="👥" label="Populasi" value={(summary?.populasi || 0).toLocaleString('id-ID')} unit=" jiwa" sub="Data terkini 2024" color="#C9A84C" />
        <StatCard icon="📍" label="Kepadatan" value={(summary?.kepadatan || 0).toLocaleString('id-ID')} unit=" /km²" sub="Rata-rata kota" color="#2471A3" />
        <StatCard icon="⚡" label="Konsumsi Energi" value={(summary?.energi_gwh || 0).toFixed(1)} unit=" GWh" sub="Bulan terakhir" color="#C47B1A" />
        <StatCard icon="💨" label="AQI Rata-rata" value={(summary?.aqi_rata || 0).toFixed(0)} unit=" AQI" sub="Rata-rata kota" color="#8E44AD" />
      </div>

      {/* Overview cards */}
      {overview && (
        <div className="overview-grid">
          <div className="overview-card">
            <span className="overview-num">{overview.totalFasilitas}</span>
            <span className="overview-lbl">Fasilitas Publik</span>
          </div>
          <div className="overview-card">
            <span className="overview-num">{overview.totalRute}</span>
            <span className="overview-lbl">Rute Aktif</span>
          </div>
          <div className="overview-card">
            <span className="overview-num">{overview.totalJalan}</span>
            <span className="overview-lbl">Ruas Jalan Dipantau</span>
          </div>
          <div className="overview-card">
            <span className="overview-num">{overview.avgAqi}</span>
            <span className="overview-lbl">Rata-rata AQI Kota</span>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Populasi Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Pertumbuhan Populasi 2024</h3>
            <span className="chart-badge">Bulanan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickFormatter={v => (v / 1000000).toFixed(1) + 'M'} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="populasi" name="Populasi" stroke={GOLD} fill="url(#popGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energi */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Konsumsi Energi (GWh)</h3>
            <span className="chart-badge">Bulanan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="energi_gwh" name="Energi (GWh)" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AQI Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Trend Kualitas Udara (AQI)</h3>
            <span className="chart-badge">Rata-rata bulanan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} domain={[0, 150]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="aqi_rata" name="AQI" stroke="#8E44AD" strokeWidth={2.5} dot={{ fill: '#8E44AD', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Kepadatan */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Kepadatan Penduduk (jiwa/km²)</h3>
            <span className="chart-badge">Bulanan</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="kdtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2471A3" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2471A3" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" />
              <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#718096' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="kepadatan" name="Kepadatan" stroke="#2471A3" fill="url(#kdtGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
