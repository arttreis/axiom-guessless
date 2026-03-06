import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BarChart2, User, ShieldCheck, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../ThemeToggle';

export function Sidebar() {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try { await signOut(); navigate('/'); } catch { /* ignore */ }
  };

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null;

  const showTrialBanner = trialDaysLeft !== null && trialDaysLeft <= 3 && profile?.plan === 'trial';

  const navItems = [
    { to: '/dashboard', end: true,            icon: <LayoutDashboard size={16} />, label: 'Relatório' },
    { to: '/dashboard/content',               icon: <Sparkles size={16} />,        label: 'Conteúdo' },
    { to: '/dashboard/analytics',             icon: <BarChart2 size={16} />,       label: 'Analytics' },
    { to: '/dashboard/account',               icon: <User size={16} />,            label: 'Minha Conta' },
  ];

  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-logo">AXIOM</NavLink>

      {showTrialBanner && (
        <div className="trial-banner">
          <span className="trial-icon">⏱</span>
          <div>
            <div className="trial-days">{trialDaysLeft}d restantes</div>
            <div className="trial-sub">período gratuito</div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {navItems.map(({ to, end, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
        {profile?.role === 'admin' && (
          <NavLink
            to="/admin/overview"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-icon"><ShieldCheck size={16} /></span>
            Admin
          </NavLink>
        )}
      </nav>

      <div className="sidebar-divider" />

      <div className="plan-card">
        <div className="plan-header">
          <span className="plan-name">{profile?.plan ?? 'trial'}</span>
          <span
            className="plan-badge"
            style={{
              backgroundColor: profile?.subscription_status === 'active' ? '#10B98120' : '#F59E0B20',
              color: profile?.subscription_status === 'active' ? '#10B981' : '#F59E0B',
            }}
          >
            {profile?.subscription_status === 'active' ? 'Ativo' : 'Trial'}
          </span>
        </div>
        <button className="btn-portal" onClick={() => {}}>Gerenciar assinatura</button>
      </div>

      <div style={{ flex: 1 }} />

      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">{profile?.name?.[0]?.toUpperCase() ?? 'U'}</div>
          <div className="user-details">
            <div className="user-name">{profile?.name ?? 'Usuário'}</div>
            <div className="user-email">{profile?.email ?? ''}</div>
          </div>
        </div>
        <div className="sidebar-bottom-row">
          <button className="btn-signout" onClick={handleSignOut}>
            <LogOut size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Sair
          </button>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
