import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function AdminLayout() {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="dashboard-root">
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          AXIOM <span style={{ fontSize: '0.6rem', opacity: 0.6, marginLeft: 4 }}>ADMIN</span>
        </NavLink>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/overview"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={15} className="sidebar-icon" />
            Visão Geral
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Users size={15} className="sidebar-icon" />
            Usuários
          </NavLink>
        </nav>

        <div className="sidebar-divider" />

        <NavLink to="/dashboard" className="sidebar-link" style={{ fontSize: '0.82rem', opacity: 0.7 }}>
          <ArrowLeft size={14} />
          Voltar ao app
        </NavLink>

        <div style={{ flex: 1 }} />

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">{profile?.name?.[0]?.toUpperCase() ?? 'A'}</div>
            <div className="user-details">
              <div className="user-name">{profile?.name ?? 'Admin'}</div>
              <div className="user-email">{profile?.email ?? ''}</div>
            </div>
          </div>
          <button className="btn-signout" onClick={handleSignOut}>
            Sair
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
