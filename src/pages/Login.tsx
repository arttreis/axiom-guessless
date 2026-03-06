import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { showToast } from '../components/Toast';

type Mode = 'login' | 'signup';

export function Login() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Já autenticado → redireciona direto
  if (!isLoading && user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('error', 'Supabase não configurado. Verifique as variáveis de ambiente.');
      return;
    }
    if (!email || !password) {
      showToast('error', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { showToast('error', error.message); return; }
      if (data.user) {
        useAuthStore.getState().setUser(data.user);
        await useAuthStore.getState().fetchProfile(data.user.id);
      }
      showToast('success', 'Bem-vindo de volta!');
      navigate('/dashboard');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      showToast('error', 'Supabase não configurado. Verifique as variáveis de ambiente.');
      return;
    }
    if (!name || !email || !password) {
      showToast('error', 'Preencha todos os campos.');
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
      if (error) { showToast('error', error.message); return; }
      if (data.user) {
        useAuthStore.getState().setUser(data.user);
        await useAuthStore.getState().fetchProfile(data.user.id);
      }
      showToast('success', 'Conta criada! Vamos configurar sua marca.');
      navigate('/onboarding');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <p className="loading-text">AXIOM</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Nav */}
      <nav className="checkout-nav">
        <Link to="/landing" className="sidebar-logo" style={{ fontSize: '1.4rem', textDecoration: 'none' }}>
          AXIOM
        </Link>
      </nav>

      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar sua conta'}
          </h1>
          <p className="checkout-subtitle">
            {mode === 'login'
              ? 'Entre para acessar seus arquétipos e conteúdos'
              : 'Descubra a identidade da sua marca com IA'}
          </p>
        </div>

        {/* Toggle login / cadastro */}
        <div className="checkout-mode-toggle">
          <button
            className={`mode-btn${mode === 'login' ? ' mode-btn--active' : ''}`}
            onClick={() => setMode('login')}
            type="button"
          >
            Entrar
          </button>
          <button
            className={`mode-btn${mode === 'signup' ? ' mode-btn--active' : ''}`}
            onClick={() => setMode('signup')}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário */}
        <form
          className="checkout-form"
          onSubmit={mode === 'login' ? handleLogin : handleSignUp}
        >
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nome</label>
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Senha</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder={mode === 'signup' ? 'Mínimo 8 caracteres' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
              </span>
            ) : (
              mode === 'login' ? 'Entrar →' : 'Criar conta →'
            )}
          </button>
        </form>

        <p className="checkout-security">
          Seus dados são protegidos com criptografia de ponta a ponta
        </p>
      </div>
    </div>
  );
}
