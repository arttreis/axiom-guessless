import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';

export function ProfileForm() {
  const { profile, saving, error, updateProfile } = useProfile();
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
    if (!file || !profile) return;
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Imagem muito grande. Máx. 2MB.');
      return;
    }
    setAvatarUploading(true);
    setAvatarError('');
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      await updateProfile({ name, avatar_url: dataUrl });
      setAvatarUploading(false);
    };
    reader.onerror = () => {
      setAvatarError('Erro ao ler o arquivo.');
      setAvatarUploading(false);
    };
    reader.readAsDataURL(file);
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
