import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createCheckoutSession, PLAN_FEATURES } from '../lib/stripe';
import { showToast } from '../components/Toast';

type Plan = 'starter' | 'pro' | 'agency';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const initialPlan = (searchParams.get('plan') as Plan) ?? 'pro';

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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      if (!data.user) throw new Error('Usuário não criado.');

      showToast('success', 'Conta criada! Redirecionando para pagamento...');
      await createCheckoutSession(plan, data.user.id, email);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.';
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
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
