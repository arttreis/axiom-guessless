import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { PLAN_FEATURES } from '../lib/stripe';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/Toast';

type Plan = 'starter' | 'pro' | 'agency';
type Mode = 'signup' | 'login';

export function Checkout() {
  const [searchParams] = useSearchParams();
  const initialPlan = (searchParams.get('plan') as Plan) ?? 'pro';
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('signup');
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
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

      if (error) {
        showToast('error', error.message);
        return;
      }

      if (data.user) {
        await supabase
          .from('profiles')
          .update({ plan, name })
          .eq('id', data.user.id);

        useAuthStore.getState().setUser(data.user);
        useAuthStore.getState().fetchProfile(data.user.id);
      }

      showToast('success', 'Conta criada! Iniciando onboarding...');
      navigate('/onboarding');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta.';
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('error', 'Preencha email e senha.');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        showToast('error', error.message);
        return;
      }

      if (data.user) {
        useAuthStore.getState().setUser(data.user);
        await useAuthStore.getState().fetchProfile(data.user.id);
      }

      showToast('success', 'Bem-vindo de volta!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao fazer login.';
      showToast('error', msg);
    } finally {
      setLoading(false);
    }
  };

  const planInfo = PLAN_FEATURES[plan];
  const isLogin = mode === 'login';

  return (
    <div className="checkout-page">
      {/* Nav */}
      <nav className="checkout-nav">
        <Link to="/" className="sidebar-logo">AXIOM</Link>
      </nav>

      <div className="checkout-container">
        {/* Toggle de modo */}
        <div className="checkout-mode-toggle">
          <button
            className={`mode-btn ${!isLogin ? 'mode-btn--active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Criar conta
          </button>
          <button
            className={`mode-btn ${isLogin ? 'mode-btn--active' : ''}`}
            onClick={() => setMode('login')}
          >
            Entrar
          </button>
        </div>

        <div className="checkout-header">
          <h1 className="checkout-title">
            {isLogin ? 'Entrar na sua conta' : 'Criar sua conta'}
          </h1>
          {!isLogin && (
            <p className="checkout-subtitle">7 dias grátis, depois {planInfo.price}</p>
          )}
        </div>

        {/* Seletor de plano — só no signup */}
        {!isLogin && (
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
        )}

        {/* Formulário */}
        <form className="checkout-form" onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
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
          )}
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
              placeholder={isLogin ? 'Sua senha' : 'Mínimo 8 caracteres'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? (
              <span className="btn-loading"><span className="spinner" /> {isLogin ? 'Entrando...' : 'Criando conta...'}</span>
            ) : (
              isLogin ? 'Entrar →' : 'Criar conta e começar →'
            )}
          </button>
        </form>

        {/* Segurança */}
        <p className="checkout-security">
          🔒 {isLogin ? 'Conexão segura · SSL' : 'Pagamento seguro · SSL · Garantia de 7 dias'}
        </p>

        {/* Card do plano — só no signup */}
        {!isLogin && (
          <div className="checkout-plan-card">
            <div className="checkout-plan-name">{planInfo.name}</div>
            <ul className="checkout-plan-features">
              <li>✓ {planInfo.posts}</li>
              <li>✓ {planInfo.platforms}</li>
              <li>✓ {planInfo.support}</li>
              {planInfo.extras.map((e) => <li key={e}>✓ {e}</li>)}
            </ul>
          </div>
        )}

        <p className="checkout-login">
          {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
          <button
            type="button"
            className="text-orange"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
            onClick={() => setMode(isLogin ? 'signup' : 'login')}
          >
            {isLogin ? 'Criar conta' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}
