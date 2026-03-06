import { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';

export function ProfileForm() {
  const { profile, saving, error, updateProfile } = useProfile();
  const [name, setName] = useState(profile?.name ?? '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <h3 className="account-section-title">Perfil</h3>

      <div className="form-field">
        <label className="form-label">Nome</label>
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
        />
      </div>

      <div className="form-field">
        <label className="form-label">E-mail</label>
        <input className="form-input" value={profile?.email ?? ''} disabled />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar alterações'}
      </button>
    </form>
  );
}
