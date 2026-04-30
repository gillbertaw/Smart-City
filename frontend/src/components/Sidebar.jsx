import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: '🏙️', label: 'Dashboard Kota' },
  { to: '/peta', icon: '🗺️', label: 'Peta Interaktif' },
  { to: '/udara', icon: '💨', label: 'Kualitas Udara' },
  { to: '/lalu-lintas', icon: '🚦', label: 'Lalu Lintas' },
  { to: '/transportasi', icon: '🚌', label: 'Transportasi' },
  { to: '/energi', icon: '⚡', label: 'Konsumsi Energi' },
  { to: '/sampah', icon: '🗑️', label: 'Tracker Sampah' },
  { to: '/layanan-kota', icon: '🏛️', label: 'Layanan Kota' },
  { to: '/layanan-publik', icon: '🏥', label: 'Layanan Publik' },
  { to: '/admin', icon: '🛡️', label: 'Panel Admin', adminOnly: true },
  { to: '/profil', icon: '👤', label: 'Profil Saya' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⚡</div>
        <div>
          <div className="sidebar-brand-name">Smart City</div>
          <div className="sidebar-brand-sub">Medan 2024</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.filter(item => !item.adminOnly || user?.role === 'admin').map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user.nama?.[0]?.toUpperCase() || 'U'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.nama || 'Pengguna'}</div>
              <div className="sidebar-user-role">{user.role || 'warga'}</div>
            </div>
          </div>
        )}
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Keluar
        </button>
      </div>
    </aside>
  );
}
