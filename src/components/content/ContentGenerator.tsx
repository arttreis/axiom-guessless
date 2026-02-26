import { useState } from 'react';
import { generatePost } from '../../lib/anthropic';
import type { OnboardingData, GeneratedPost } from '../../types';

interface ContentGeneratorProps {
  brandContext: Partial<OnboardingData>;
  primaryArchetype: string;
  onGenerated: (post: GeneratedPost) => void;
}

export function ContentGenerator({ brandContext, primaryArchetype, onGenerated }: ContentGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const fullPrompt = platform ? `${prompt} [Plataforma: ${platform}]` : prompt;
      const post = await generatePost(fullPrompt, brandContext as OnboardingData, primaryArchetype);
      onGenerated(post);
      setPrompt('');
    } catch (err) {
      setError('Erro ao gerar post. Verifique sua chave da API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-generator">
      <div className="generator-header">
        <span className="generator-icon">✦</span>
        <span className="generator-title">Gerar Conteúdo com IA</span>
      </div>

      <textarea
        className="generator-textarea"
        placeholder="Descreva o post que você quer criar... Ex: Um carrossel sobre os 3 maiores erros de branding"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        disabled={loading}
      />

      <div className="generator-actions">
        <select
          className="generator-platform-select"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          disabled={loading}
        >
          <option value="">Qualquer plataforma</option>
          <option value="Instagram">Instagram</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Twitter/X">Twitter/X</option>
          <option value="YouTube">YouTube</option>
        </select>

        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner" />
              Gerando com IA...
            </span>
          ) : (
            'Gerar Post →'
          )}
        </button>
      </div>

      {error && <p className="generator-error">{error}</p>}
    </div>
  );
}
