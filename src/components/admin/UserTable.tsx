import { useNavigate } from 'react-router-dom';
import type { Profile } from '../../types';

interface UserTableProps {
  users: Profile[];
  loading: boolean;
}

const PLAN_COLORS: Record<string, string> = {
  trial: '#FF922B',
  starter: '#7C5CBF',
  pro: '#1A936F',
  agency: '#1c7ed6',
};

export function UserTable({ users, loading }: UserTableProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: 200 }}>
        <div className="loading-icon animate-float">✦</div>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Plano</th>
            <th>Status</th>
            <th>Desde</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || '—'}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className="plan-badge"
                  style={{
                    backgroundColor: `${PLAN_COLORS[user.plan] ?? '#888'}22`,
                    color: PLAN_COLORS[user.plan] ?? '#888',
                  }}
                >
                  {user.plan}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${user.subscription_status === 'active' ? 'published' : 'draft'}`}>
                  {user.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
              <td>
                <button
                  className="btn-table-action"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="table-empty">Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
