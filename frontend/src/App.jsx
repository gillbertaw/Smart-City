import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// App pages
import ProfileDashboard from './pages/profile/ProfileDashboard';
import DashboardKota from './pages/dashboard/DashboardKota';
import PetaInteraktif from './pages/peta/PetaInteraktif';
import KualitasUdara from './pages/udara/KualitasUdara';
import LaluLintas from './pages/lalulintas/LaluLintas';
import Transportasi from './pages/transportasi/Transportasi';
import LayananKota from './pages/layanan/LayananKota';
import LayananPublik from './pages/publik/LayananPublik';
import AdminPanel from './pages/admin/AdminPanel';
import Energi from "./pages/energi/Energi";
import Sampah from "./pages/sampah/Sampah";

import './index.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#0A1628', color: '#C9A84C',
      fontSize: 18, fontFamily: 'Poppins, sans-serif'
    }}>
      ⚡ Smart City Medan...
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login"           element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register"        element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />

      <Route path="/" element={<ProtectedRoute><DashboardKota /></ProtectedRoute>} />
      <Route path="/peta" element={<ProtectedRoute><PetaInteraktif /></ProtectedRoute>} />
      <Route path="/udara" element={<ProtectedRoute><KualitasUdara /></ProtectedRoute>} />
      <Route path="/lalu-lintas" element={<ProtectedRoute><LaluLintas /></ProtectedRoute>} />
      <Route path="/transportasi" element={<ProtectedRoute><Transportasi /></ProtectedRoute>} />
      <Route path="/layanan-kota" element={<ProtectedRoute><LayananKota /></ProtectedRoute>} />
      <Route path="/layanan-publik" element={<ProtectedRoute><LayananPublik /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
      <Route path="/energi" element={<ProtectedRoute><Energi /></ProtectedRoute>} />
      <Route path="/sampah" element={<ProtectedRoute><Sampah /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
