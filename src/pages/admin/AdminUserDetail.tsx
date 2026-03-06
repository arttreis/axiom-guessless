import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types';

const PLAN_COLORS: Record<string, string> = {
  trial: '#FF922B',
  starter: '#7C5CBF',
  pro: '#1A936F',
  agency: '#1c7ed6',
};

export function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (data) setUser(data as Profile);
      setLoading(false);
    };
    void fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon animate-float">✦</div>
        <p className="loading-text">Carregando usuário...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-content">
        <p>Usuário não encontrado.</p>
        <button className="btn-primary" onClick={() => navigate('/admin/users')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="dashboard-content animate-fade-up">
      <div className="dashboard-header">
        <button
          className="sidebar-link"
          style={{ marginBottom: 8, background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/admin/users')}
        >
          ← Voltar
        </button>
        <div className="dashboard-label">ADMIN · USUÁRIO</div>
        <h1 className="dashboard-brand-name">{user.name || user.email}</h1>
      </div>

      <div className="account-grid">
        <div className="account-card">
          <h3 className="account-section-title">Informações</h3>
          <div className="form-field">
            <label className="form-label">Nome</label>
            <p className="detail-value">{user.name || '—'}</p>
          </div>
          <div className="form-field">
            <label className="form-label">E-mail</label>
            <p className="detail-value">{user.email}</p>
          </div>
          <div className="form-field">
            <label className="form-label">Membro desde</label>
            <p className="detail-value">{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="account-card">
          <h3 className="account-section-title">Plano & Status</h3>
          <div className="plan-info-row">
            <span
              className="plan-badge"
              style={{
                backgroundColor: `${PLAN_COLORS[user.plan] ?? '#888'}22`,
                color: PLAN_COLORS[user.plan] ?? '#888',
                fontSize: '1rem',
                padding: '4px 12px',
              }}
            >
              {user.plan}
            </span>
            <span className={`status-badge status-${user.subscription_status === 'active' ? 'published' : 'draft'}`}>
              {user.subscription_status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {user.trial_ends_at && (
            <div className="form-field" style={{ marginTop: 12 }}>
              <label className="form-label">Trial expira em</label>
              <p className="detail-value">{new Date(user.trial_ends_at).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
