import { useEffect, useState } from "react";
import Layout from '../../components/Layout';
import api from "../../utils/api";
import "./LaporanBanjir.css";

const STATUS_CONFIG = {
  "Kritis": { color: "status-kritis", icon: "🔴" },
  "Waspada": { color: "status-waspada", icon: "🟡" },
  "Normal": { color: "status-normal", icon: "🟢" },
  "Surut": { color: "status-surut", icon: "🔵" },
};

const TINGGI_CONFIG = (cm) => {
  if (cm >= 100) return "Kritis";
  if (cm >= 50) return "Waspada";
  if (cm > 0) return "Normal";
  return "Surut";
};

export default function LaporanBanjir() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [filterKecamatan, setFilterKecamatan] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [form, setForm] = useState({
    lokasi: "",
    kecamatan: "",
    kelurahan: "",
    tinggi_air_cm: "",
    keterangan: "",
    pelapor: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    api.get("/banjir")
      .then(res => {
        const result = res.data.data || [];
        setData(result);
        setFiltered(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    let hasil = data;
    if (filterKecamatan !== "Semua") {
      hasil = hasil.filter(d => d.kecamatan === filterKecamatan);
    }
    if (filterStatus !== "Semua") {
      hasil = hasil.filter(d => TINGGI_CONFIG(d.tinggi_air_cm) === filterStatus);
    }
    setFiltered(hasil);
  }, [filterStatus, filterKecamatan, data]);

  const kecamatanList = ["Semua", ...new Set(data.map(d => d.kecamatan).filter(Boolean))];
  const statusList = ["Semua", "Kritis", "Waspada", "Normal", "Surut"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMsg(null);
    try {
      await api.post("/banjir", {
        ...form,
        tinggi_air_cm: parseInt(form.tinggi_air_cm),
      });
      setSubmitMsg({ type: "success", text: "✅ Laporan berhasil dikirim!" });
      setForm({ lokasi: "", kecamatan: "", kelurahan: "", tinggi_air_cm: "", keterangan: "", pelapor: "" });
      fetchData();
      setTimeout(() => setShowForm(false), 1500);
    } catch {
      setSubmitMsg({ type: "error", text: "❌ Gagal mengirim laporan. Coba lagi." });
    }
    setSubmitLoading(false);
  };

  const totalKritis = data.filter(d => TINGGI_CONFIG(d.tinggi_air_cm) === "Kritis").length;
  const totalWaspada = data.filter(d => TINGGI_CONFIG(d.tinggi_air_cm) === "Waspada").length;
  const totalNormal = data.filter(d => TINGGI_CONFIG(d.tinggi_air_cm) === "Normal").length;

  if (loading) return (
    <Layout>
      <div className="banjir-container">
        <p className="banjir-loading">⏳ Memuat data titik banjir...</p>
      </div>
    </Layout>
  );

  return (
    <Layout title="" subtitle="">
      <div className="banjir-container">
        <div className="banjir-header">
          <div>
            <h1>🌊 Laporan Titik Banjir</h1>
            <p>Pantau kondisi banjir real-time di seluruh kecamatan</p>
          </div>
          <button className="btn-laporkan" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Tutup" : "+ Laporkan Banjir"}
          </button>
        </div>

        {showForm && (
          <div className="banjir-form-card">
            <h2>📋 Form Laporan Banjir</h2>
            {submitMsg && (
              <div className={`submit-msg ${submitMsg.type}`}>{submitMsg.text}</div>
            )}
            <form onSubmit={handleSubmit} className="banjir-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nama Lokasi / Jalan *</label>
                  <input name="lokasi" value={form.lokasi} onChange={handleChange} placeholder="Contoh: Jl. Gatot Subroto" required />
                </div>
                <div className="form-group">
                  <label>Kecamatan *</label>
                  <input name="kecamatan" value={form.kecamatan} onChange={handleChange} placeholder="Nama kecamatan" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kelurahan</label>
                  <input name="kelurahan" value={form.kelurahan} onChange={handleChange} placeholder="Nama kelurahan" />
                </div>
                <div className="form-group">
                  <label>Tinggi Air (cm) *</label>
                  <input type="number" name="tinggi_air_cm" value={form.tinggi_air_cm} onChange={handleChange} placeholder="Contoh: 75" min="1" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nama Pelapor</label>
                  <input name="pelapor" value={form.pelapor} onChange={handleChange} placeholder="Nama atau anonim" />
                </div>
                <div className="form-group">
                  <label>Keterangan Tambahan</label>
                  <input name="keterangan" value={form.keterangan} onChange={handleChange} placeholder="Info tambahan (opsional)" />
                </div>
              </div>
              <button type="submit" className="btn-submit" disabled={submitLoading}>
                {submitLoading ? "Mengirim..." : "🚀 Kirim Laporan"}
              </button>
            </form>
          </div>
        )}

        <div className="banjir-stats">
          <div className="stat-card stat-kritis">
            <span className="stat-icon">🔴</span>
            <div>
              <p className="stat-label">Kritis (≥100cm)</p>
              <p className="stat-value">{totalKritis}</p>
            </div>
          </div>
          <div className="stat-card stat-waspada">
            <span className="stat-icon">🟡</span>
            <div>
              <p className="stat-label">Waspada (50–99cm)</p>
              <p className="stat-value">{totalWaspada}</p>
            </div>
          </div>
          <div className="stat-card stat-normal">
            <span className="stat-icon">🟢</span>
            <div>
              <p className="stat-label">Normal (&lt;50cm)</p>
              <p className="stat-value">{totalNormal}</p>
            </div>
          </div>
          <div className="stat-card stat-total">
            <span className="stat-icon">📍</span>
            <div>
              <p className="stat-label">Total Titik</p>
              <p className="stat-value">{data.length}</p>
            </div>
          </div>
        </div>

        <div className="banjir-filter">
          <select value={filterKecamatan} onChange={e => setFilterKecamatan(e.target.value)}>
            {kecamatanList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            {statusList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span className="filter-count">{filtered.length} titik ditemukan</span>
        </div>

        {filtered.length === 0 ? (
          <div className="banjir-empty">
            <p>💧 Tidak ada titik banjir yang cocok dengan filter.</p>
          </div>
        ) : (
          <div className="banjir-grid">
            {filtered.map(item => {
              const status = TINGGI_CONFIG(item.tinggi_air_cm);
              const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Normal"];
              return (
                <div key={item.id} className={`banjir-card border-${status.toLowerCase()}`}>
                  <div className="card-top">
                    <span className={`status-badge ${cfg.color}`}>
                      {cfg.icon} {status}
                    </span>
                    <span className="card-tinggi">{item.tinggi_air_cm} cm</span>
                  </div>
                  <h3>{item.lokasi}</h3>
                  <p>📍 {item.kelurahan ? `${item.kelurahan}, ` : ""}{item.kecamatan}</p>
                  {item.keterangan && <p className="card-ket">📝 {item.keterangan}</p>}
                  {item.pelapor && <p className="card-pelapor">👤 {item.pelapor}</p>}
                  <p className="card-waktu">🕐 {item.waktu_laporan
                    ? new Date(item.waktu_laporan).toLocaleString("id-ID")
                    : new Date(item.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
