import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const ROUTE_NAMES: Record<string, string> = {
  '/dashboard':           'Relatório da Marca',
  '/dashboard/content':   'Conteúdo',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/account':   'Minha Conta',
  '/admin/overview':      'Admin — Visão Geral',
  '/admin/users':         'Admin — Usuários',
};

interface TopBarProps {
  onOpenCmd?: () => void;
}

export function TopBar({ onOpenCmd }: TopBarProps) {
  const { pathname } = useLocation();
  const { profile } = useAuthStore();
  const title = ROUTE_NAMES[pathname] ?? 'Axiom';

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <button className="topbar-search" onClick={onOpenCmd} title="Pesquisar (⌘K)">
          <Search size={14} />
          <span>Buscar</span>
          <kbd>⌘K</kbd>
        </button>
        <div className="topbar-avatar" title={profile?.name ?? ''}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
            : (profile?.name?.[0]?.toUpperCase() ?? 'U')
          }
        </div>
      </div>
    </div>
  );
}
