import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        {(title || subtitle) && (
          <div className="layout-header">
            <div>
              {title && <h1 className="layout-title">{title}</h1>}
              {subtitle && <p className="layout-subtitle">{subtitle}</p>}
            </div>
            <Link to="/" className="layout-home-link">
              Homepage
            </Link>
          </div>
        )}
        <div className="layout-content">{children}</div>
      </main>
    </div>
  );
}
