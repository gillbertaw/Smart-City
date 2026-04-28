import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import './LaluLintas.css';

const STATUS_CONFIG = {
  Lancar: { color: '#2471A3', bg: '#EEF3FA', text: '#0D1F3C', icon: '🔵' },
  Padat:  { color: '#F39C12', bg: '#FEF9E7', text: '#7D6608', icon: '🟡' },
  Macet:  { color: '#E74C3C', bg: '#FDEDEC', text: '#922B21', icon: '🔴' },
};

export default function LaluLintas() {
  const [traffic, setTraffic] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Semua');

  useEffect(() => {
    Promise.all([
      api.get('/traffic'),
      api.get('/traffic/summary'),
    ]).then(([t, s]) => {
      setTraffic(t.data.data);
      setSummary(s.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = filterStatus === 'Semua'
    ? traffic
    : traffic.filter(t => t.status === filterStatus);

  return (
    <Layout title="Status Lalu Lintas" subtitle="Pemantauan Jalan Utama Kota Medan">
      {/* Summary */}
      {summary && (
        <div className="traffic-summary">
          {['Lancar', 'Padat', 'Macet'].map(s => (
            <div key={s} className="traffic-sum-card" style={{ borderColor: STATUS_CONFIG[s].color }}>
              <span style={{ fontSize: 28 }}>{STATUS_CONFIG[s].icon}</span>
              <span className="traffic-sum-num" style={{ color: STATUS_CONFIG[s].color }}>{summary[s.toLowerCase()]}</span>
              <span className="traffic-sum-label">{s}</span>
            </div>
          ))}
          <div className="traffic-sum-card" style={{ borderColor: '#C9A84C' }}>
            <span style={{ fontSize: 28 }}>🛣️</span>
            <span className="traffic-sum-num" style={{ color: '#C9A84C' }}>{summary.total}</span>
            <span className="traffic-sum-label">Total Ruas</span>
          </div>
        </div>
      )}

      <div className="traffic-layout">
        {/* Table */}
        <div className="traffic-table-wrap">
          <div className="traffic-table-header">
            <h3>Daftar Ruas Jalan</h3>
            <div className="traffic-filters">
              {['Semua', 'Lancar', 'Padat', 'Macet'].map(f => (
                <button
                  key={f}
                  className={`trf-filter-btn ${filterStatus === f ? 'active' : ''}`}
                  style={filterStatus === f && f !== 'Semua' ? { background: STATUS_CONFIG[f]?.color, borderColor: STATUS_CONFIG[f]?.color } : {}}
                  onClick={() => setFilterStatus(f)}
                >
                  {f !== 'Semua' && STATUS_CONFIG[f]?.icon + ' '}{f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="table-loading">⏳ Memuat data...</div>
          ) : (
            <table className="traffic-table">
              <thead>
                <tr>
                  <th>Nama Jalan</th>
                  <th>Ruas</th>
                  <th>Status</th>
                  <th>Kecepatan</th>
                  <th>Kendaraan/Jam</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const cfg = STATUS_CONFIG[t.status];
                  return (
                    <tr key={t.id} className="traffic-row">
                      <td><strong>{t.nama_jalan}</strong></td>
                      <td className="traffic-ruas">{t.ruas}</td>
                      <td>
                        <span className="status-badge" style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.color}44` }}>
                          {cfg.icon} {t.status}
                        </span>
                      </td>
                      <td>
                        <span className="speed-val" style={{ color: cfg.color }}>
                          {t.kecepatan_kmh} km/h
                        </span>
                      </td>
                      <td>{(t.kendaraan_per_jam || 0).toLocaleString('id-ID')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Map */}
        <div className="traffic-map-wrap">
          <div className="traffic-map-title">Peta Kondisi Jalan</div>
          <div className="traffic-map">
            {!loading && (
              <MapContainer center={[3.5896, 98.6739]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: 10 }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                {traffic.map(t => {
                  if (!t.lat_start || !t.lat_end) return null;
                  const cfg = STATUS_CONFIG[t.status];
                  return (
                    <Polyline
                      key={t.id}
                      positions={[[t.lat_start, t.lng_start], [t.lat_end, t.lng_end]]}
                      color={cfg.color}
                      weight={5}
                      opacity={0.85}
                    >
                      <Popup>
                        <div>
                          <strong>{t.nama_jalan}</strong><br />
                          <span>{t.ruas}</span><br />
                          <span style={{ color: cfg.color, fontWeight: 700 }}>{cfg.icon} {t.status}</span><br />
                          <span>{t.kecepatan_kmh} km/h · {(t.kendaraan_per_jam || 0).toLocaleString()} kendaraan/jam</span>
                        </div>
                      </Popup>
                    </Polyline>
                  );
                })}
              </MapContainer>
            )}
          </div>
          {/* Map Legend */}
          <div className="map-legend">
            {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
              <div key={s} className="map-legend-item">
                <div className="map-legend-line" style={{ background: cfg.color }}></div>
                <span>{cfg.icon} {s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
