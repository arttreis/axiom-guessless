import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PLAN_FEATURES } from '../lib/stripe';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../components/Toast';
import type { User } from '@supabase/supabase-js';

type Plan = 'starter' | 'pro' | 'agency';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const initialPlan = (searchParams.get('plan') as Plan) ?? 'pro';
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('error', 'Preencha todos os campos obrigatórios.');
      return;
    }
    if (password.length < 8) {
      showToast('error', 'Senha deve ter ao menos 8 caracteres.');
      return;
    }
    setLoading(true);

    // DEMO MODE — Simular criação de conta sem Supabase/Stripe
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { setUser, setProfile } = useAuthStore.getState();
    setUser({ id: 'demo-user-id', email } as unknown as User);
    setProfile({
      id: 'demo-user-id',
      name,
      email,
      plan,
      stripe_customer_id: '',
      stripe_subscription_id: '',
      subscription_status: 'active',
      trial_ends_at: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    showToast('success', 'Conta criada! Iniciando onboarding...');
    setLoading(false);
    navigate('/onboarding');
  };

  const planInfo = PLAN_FEATURES[plan];

  return (
    <div className="checkout-page">
      {/* Nav */}
      <nav className="checkout-nav">
        <Link to="/" className="sidebar-logo">AXIOM</Link>
      </nav>

      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Criar sua conta</h1>
          <p className="checkout-subtitle">7 dias grátis, depois {planInfo.price}</p>
        </div>

        {/* Seletor de plano */}
        <div className="plan-selector">
          {(['starter', 'pro', 'agency'] as Plan[]).map((p) => (
            <button
              key={p}
              className={`plan-btn ${plan === p ? 'plan-btn--active' : ''}`}
              onClick={() => setPlan(p)}
            >
              <span className="plan-btn-name">{PLAN_FEATURES[p].name}</span>
              <span className="plan-btn-price">{PLAN_FEATURES[p].price}</span>
            </button>
          ))}
        </div>

        {/* Formulário */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <input
              type="text"
              className="form-input"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner" /> Criando conta...</span>
            ) : (
              'Criar conta e começar →'
            )}
          </button>
        </form>

        {/* Segurança */}
        <p className="checkout-security">
          🔒 Pagamento seguro · SSL · Garantia de 7 dias
        </p>

        {/* Card do plano */}
        <div className="checkout-plan-card">
          <div className="checkout-plan-name">{planInfo.name}</div>
          <ul className="checkout-plan-features">
            <li>✓ {planInfo.posts}</li>
            <li>✓ {planInfo.platforms}</li>
            <li>✓ {planInfo.support}</li>
            {planInfo.extras.map((e) => <li key={e}>✓ {e}</li>)}
          </ul>
        </div>

        <p className="checkout-login">
          Já tem conta?{' '}
          <Link to="/dashboard" className="text-orange">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
