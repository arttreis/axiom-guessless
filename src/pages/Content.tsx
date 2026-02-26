import { useState } from 'react';
import { ContentGenerator } from '../components/content/ContentGenerator';
import { PostCard } from '../components/content/PostCard';
import { PostFilter, type FilterValue } from '../components/content/PostFilter';
import { PostStats } from '../components/content/PostStats';
import { usePosts } from '../hooks/usePosts';
import { useOnboarding } from '../hooks/useOnboarding';
import { showToast } from '../components/Toast';
import type { GeneratedPost } from '../types';

export function Content() {
  const { posts, loading, savePost } = usePosts();
  const { onboarding, archetypeResult } = useOnboarding();
  const [showGenerator, setShowGenerator] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('Todos');

  const filteredPosts = filter === 'Todos' ? posts : posts.filter((p) => p.platform === filter);

  const handleGenerated = async (generated: GeneratedPost) => {
    const saved = await savePost(generated);
    if (saved) {
      showToast('success', 'Post gerado e salvo com sucesso!');
      setShowGenerator(false);
    } else {
      showToast('error', 'Erro ao salvar post gerado.');
    }
  };

  return (
    <div className="content-page animate-fade-up">
      {/* Header */}
      <div className="content-header">
        <div>
          <div className="dashboard-label">CONTEÚDO</div>
          <h1 className="content-title">
            Seus Posts <span className="posts-count">({posts.length})</span>
          </h1>
        </div>
        <button
          className={showGenerator ? 'btn-outline' : 'btn-primary'}
          onClick={() => setShowGenerator(!showGenerator)}
        >
          {showGenerator ? '✕ Fechar' : '+ Gerar Conteúdo'}
        </button>
      </div>

      {/* Gerador */}
      {showGenerator && (
        <ContentGenerator
          brandContext={onboarding ?? {}}
          primaryArchetype={archetypeResult?.primary_archetype ?? 'O Herói'}
          onGenerated={handleGenerated}
        />
      )}

      {/* Stats */}
      <PostStats posts={posts} />

      {/* Filtros */}
      <PostFilter active={filter} onChange={setFilter} />

      {/* Grid de posts */}
      {loading ? (
        <div className="posts-loading">
          <div className="loading-icon animate-float">✦</div>
          <p>Carregando posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="posts-empty">
          <div className="empty-icon">✦</div>
          <p className="empty-title">Nenhum post encontrado</p>
          <p className="empty-sub">Clique em &quot;+ Gerar Conteúdo&quot; para criar seu primeiro post com IA.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
