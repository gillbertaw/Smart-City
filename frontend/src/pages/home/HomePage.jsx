import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/BrandLogo';
import './HomePage.css';

const services = [
  {
    title: 'Monitoring Kota',
    text: 'Pantau lalu lintas, kualitas udara, energi, transportasi, dan fasilitas publik dalam satu dashboard.',
  },
  {
    title: 'Layanan Warga',
    text: 'Warga dapat mengirim laporan banjir, pengaduan umum, voting kebijakan, survei layanan, dan diskusi kebijakan.',
  },
  {
    title: 'Layanan Publik',
    text: 'Informasi rumah sakit, CCTV, zona aman, sekolah, universitas, lowongan kerja, dan UMKM lokal.',
  },
  {
    title: 'Panel Admin',
    text: 'Admin dapat mengelola kebijakan, laporan warga, pengumuman, master data, alert bencana, dan log aktivitas.',
  },
];

const highlights = [
  'React Vite',
  'Express API',
  'MySQL Sequelize',
  'MongoDB Logs',
  'Recharts',
  'OpenStreetMap',
];

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-container home-nav-inner">
          <Link className="home-brand" to="/">
            <BrandLogo compact />
          </Link>
          <nav className="home-nav-links">
            <a href="#layanan">Layanan</a>
            <a href="#fitur">Fitur</a>
            <a href="#about">About Us</a>
            <a href="#demo">Demo</a>
            {user ? (
              <Link to="/dashboard" className="home-button home-button-gold">Dashboard</Link>
            ) : (
              <Link to="/login" className="home-button home-button-outline">Login</Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="home-hero">
          <div className="home-container hero-grid">
            <div className="hero-copy">
              <span className="hero-badge">Portal Digital Warga</span>
              <h1>Smart City Medan</h1>
              <p>
                Platform terpadu untuk memantau kondisi kota, mengelola layanan publik,
                menerima laporan warga, dan mendukung pengambilan kebijakan berbasis data.
              </p>
              <div className="hero-actions">
                <Link to={user ? '/dashboard' : '/login'} className="home-button home-button-gold home-button-large">
                  Mulai Gunakan
                </Link>
                <a href="#layanan" className="home-button home-button-dark home-button-large">Lihat Layanan</a>
              </div>
            </div>
            <div className="hero-panel" aria-label="Ringkasan fitur Smart City">
              <div className="panel-topline">
                <span>Status Sistem</span>
                <strong>Online</strong>
              </div>
              <div className="metric-grid">
                <div><strong>25</strong><span>Fitur Kota</span></div>
                <div><strong>2</strong><span>Database</span></div>
                <div><strong>1</strong><span>Portal Admin</span></div>
                <div><strong>REST</strong><span>API</span></div>
              </div>
              <div className="panel-strip">
                {highlights.map(item => <span key={item}>{item}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section id="layanan" className="home-section">
          <div className="home-container">
            <div className="section-heading">
              <span>Jasa yang Disediakan</span>
              <h2>Layanan digital untuk warga dan pemerintah kota</h2>
            </div>
            <div className="service-grid">
              {services.map(service => (
                <article className="service-card" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="fitur" className="feature-band">
          <div className="home-container feature-grid">
            <div>
              <span className="section-kicker">Tampilan Frontend</span>
              <h2>Clean landing page untuk menjelaskan layanan aplikasi</h2>
              <p>
                Halaman awal dibuat lebih ringan dengan navigasi sederhana, tombol jelas,
                card layanan, dan grid responsive yang konsisten dengan warna Smart City.
              </p>
            </div>
            <div className="feature-list">
              <span>Header bersih</span>
              <span>CTA utama</span>
              <span>Card layanan ringkas</span>
              <span>Grid responsive</span>
              <span>Demo access</span>
            </div>
          </div>
        </section>

        <section id="about" className="home-section about-section">
          <div className="home-container about-grid">
            <div>
              <span className="section-kicker">About Us</span>
              <h2>Dibangun untuk simulasi layanan kota digital yang modern.</h2>
              <p>
                Smart City Medan adalah project akademik yang dirancang untuk menampilkan
                bagaimana data kota, layanan warga, laporan publik, dan panel admin dapat
                dikelola dalam satu sistem terpadu.
              </p>
              <p>
                Fokus aplikasi ini adalah monitoring kota, partisipasi warga, transparansi
                kebijakan, dan pengelolaan layanan publik berbasis web.
              </p>
            </div>
            <div className="about-card">
              <h3>Tim Pengembang</h3>
              <ul>
                <li>William Wiryawan</li>
                <li>Gillbert Allison Wijaya</li>
                <li>Dicky Sasqia</li>
                <li>Deidrich Zhu</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="demo" className="home-section demo-section">
          <div className="home-container demo-card">
            <div>
              <span>Siap Demo</span>
              <h2>Masuk sebagai guest untuk mencoba fitur warga.</h2>
              <p>Untuk admin, gunakan akun dengan role admin agar menu Panel Admin terbuka.</p>
            </div>
            <Link to={user ? '/dashboard' : '/login'} className="home-button home-button-gold home-button-large">
              {user ? 'Buka Dashboard' : 'Login / Guest Mode'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <div className="home-container footer-grid">
          <div>
            <Link className="footer-brand" to="/">
              <BrandLogo compact />
            </Link>
            <p>
              Portal digital untuk monitoring kota, layanan warga, informasi publik,
              dan administrasi smart city.
            </p>
          </div>
          <div>
            <h4>Navigasi</h4>
            <a href="#layanan">Layanan</a>
            <a href="#fitur">Fitur</a>
            <a href="#about">About Us</a>
            <Link to={user ? '/dashboard' : '/login'}>Dashboard</Link>
          </div>
          <div>
            <h4>Layanan</h4>
            <span>Monitoring Kota</span>
            <span>Laporan Warga</span>
            <span>Voting Kebijakan</span>
            <span>Panel Admin</span>
          </div>
          <div>
            <h4>Kontak</h4>
            <span>Medan, Indonesia</span>
            <span>smartcity@medan.local</span>
            <span>Senin - Jumat</span>
            <span>08:00 - 17:00 WIB</span>
          </div>
        </div>
        <div className="home-container footer-bottom">
          <span>© 2026 Smart City Medan. Project akademik.</span>
          <span>React · Express · MySQL · MongoDB</span>
        </div>
      </footer>
    </div>
  );
}
