import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function Sidebar() {
  const { profile, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      console.error('Erro ao sair');
    }
  };

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const showTrialBanner = trialDaysLeft !== null && trialDaysLeft <= 3 && profile?.plan === 'trial';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <NavLink to="/" className="sidebar-logo">
        AXIOM
      </NavLink>

      {/* Trial Banner */}
      {showTrialBanner && (
        <div className="trial-banner">
          <span className="trial-icon">⏱</span>
          <div>
            <div className="trial-days">{trialDaysLeft} dias restantes</div>
            <div className="trial-sub">no período gratuito</div>
          </div>
        </div>
      )}

      {/* Navegação */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">◈</span>
          Relatório da Marca
        </NavLink>
        <NavLink
          to="/dashboard/content"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">✦</span>
          Conteúdo
        </NavLink>
      </nav>

      <div className="sidebar-divider" />

      {/* Card do plano */}
      <div className="plan-card">
        <div className="plan-header">
          <span className="plan-name">{profile?.plan ?? 'trial'}</span>
          <span
            className="plan-badge"
            style={{
              backgroundColor:
                profile?.subscription_status === 'active' ? '#1A936F22' : '#FF922B22',
              color:
                profile?.subscription_status === 'active' ? '#1A936F' : '#FF922B',
            }}
          >
            {profile?.subscription_status === 'active' ? 'Ativo' : 'Trial'}
          </span>
        </div>
        <button className="btn-portal" onClick={() => {}}>
          Gerenciar assinatura
        </button>
      </div>

      <div style={{ flex: 1 }} />

      {/* Usuário */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">{profile?.name?.[0]?.toUpperCase() ?? 'U'}</div>
          <div className="user-details">
            <div className="user-name">{profile?.name ?? 'Usuário'}</div>
            <div className="user-email">{profile?.email ?? ''}</div>
          </div>
        </div>
        <button className="btn-signout" onClick={handleSignOut}>
          Sair
        </button>
      </div>
    </aside>
  );
}
