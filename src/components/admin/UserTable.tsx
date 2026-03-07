import { useNavigate } from 'react-router-dom';
import { ChevronRight, Circle } from 'lucide-react';
import type { Profile } from '../../types';

interface UserTableProps {
  users: Profile[];
  loading: boolean;
}

const PLAN_COLORS: Record<string, string> = {
  trial:   '#FF922B',
  starter: '#7C5CBF',
  pro:     '#1A936F',
  agency:  '#3D6FF8',
};

export function UserTable({ users, loading }: UserTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="user-cards-grid">
        {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" style={{ height: 88 }} />)}
      </div>
    );
  }

  if (users.length === 0) {
    return <p className="admin-detail-empty">Nenhum usuário encontrado.</p>;
  }

  return (
    <div className="user-cards-grid">
      {users.map((user) => {
        const planColor = PLAN_COLORS[user.plan] ?? '#888';
        const isActive = user.subscription_status === 'active';
        const initials = (user.name || user.email || '?').slice(0, 2).toUpperCase();

        return (
          <div
            key={user.id}
            className="user-card"
            onClick={() => navigate(`/admin/users/${user.id}`)}
          >
            {/* Avatar */}
            <div className="user-card-avatar">
              {user.avatar_url
                ? <img src={user.avatar_url} alt={user.name || user.email} className="user-card-avatar-img" />
                : <span className="user-card-avatar-initials">{initials}</span>
              }
            </div>

            {/* Info */}
            <div className="user-card-info">
              <div className="user-card-name">{user.name || <span style={{ color: 'var(--text-muted)' }}>Sem nome</span>}</div>
              <div className="user-card-email">{user.email}</div>
              <div className="user-card-meta">
                <span className="plan-badge" style={{ background: `${planColor}18`, color: planColor, fontSize: '0.72rem', padding: '2px 8px' }}>
                  {user.plan}
                </span>
                <span className="user-card-status">
                  <Circle size={6} fill={isActive ? '#4ade80' : '#6b7280'} color={isActive ? '#4ade80' : '#6b7280'} />
                  {isActive ? 'Ativo' : 'Trial'}
                </span>
                <span className="user-card-since">
                  {new Date(user.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' })}
                </span>
              </div>
            </div>

            <ChevronRight size={16} className="user-card-arrow" />
          </div>
        );
      })}
    </div>
  );
}
