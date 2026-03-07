import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProfile } from '../../hooks/useProfile';
import { useAuthStore } from '../../store/authStore';

export function ProfileForm() {
  const { profile, saving, error, updateProfile } = useProfile();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInitialized = useRef(false);

  // Inicializa o nome uma única vez quando o profile carrega
  useEffect(() => {
    if (profile && !nameInitialized.current) {
      setName(profile.name ?? '');
      nameInitialized.current = true;
    }
  }, [profile]);

  // Avatar sempre sincroniza com o store (atualizado após upload)
  useEffect(() => {
    setAvatarUrl(profile?.avatar_url ?? '');
  }, [profile?.avatar_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    setAvatarError('');
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadErr) {
      setAvatarError(`Erro: ${uploadErr.message}`);
      setAvatarUploading(false);
      return;
    }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;
    setAvatarUrl(url);
    await updateProfile({ name, avatar_url: url });
    setAvatarUploading(false);
  };

  const initials = (profile?.name ?? profile?.email ?? '?').slice(0, 2).toUpperCase();

  return (
    <form className="account-form" onSubmit={handleSubmit}>
      <h3 className="account-section-title">Perfil</h3>

      {/* Avatar */}
      <div className="avatar-upload-wrap">
        <div className="avatar-circle" onClick={() => fileInputRef.current?.click()}>
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" className="avatar-img" />
            : <span className="avatar-initials">{initials}</span>
          }
          <div className="avatar-overlay">
            {avatarUploading ? <span className="spinner" /> : <Camera size={16} />}
          </div>
        </div>
        <div className="avatar-info">
          <span className="avatar-hint">Clique para alterar a foto</span>
          <span className="avatar-sub">JPG, PNG ou WEBP — máx. 2MB</span>
          {avatarError && <span style={{ fontSize: '0.78rem', color: '#f87171' }}>{avatarError}</span>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => void handleAvatarChange(e)}
        />
      </div>

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
