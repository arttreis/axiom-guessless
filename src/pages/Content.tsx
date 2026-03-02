import { useState, useEffect } from 'react';
import { ContentGenerator } from '../components/content/ContentGenerator';
import { PostCard } from '../components/content/PostCard';
import { PostFilter, type FilterValue } from '../components/content/PostFilter';
import { PostStats } from '../components/content/PostStats';
import { usePosts } from '../hooks/usePosts';
import { useOnboarding } from '../hooks/useOnboarding';
import { showToast } from '../components/Toast';
import type { GeneratedPost, OnboardingData } from '../types';

export function Content() {
  const { posts, loading, isInitializing, savePost, initializePosts, deletePost, updatePostStatus } = usePosts();
  const { onboarding, archetypeResult } = useOnboarding();
  const [showGenerator, setShowGenerator] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('Todos');

  useEffect(() => {
    if (onboarding && archetypeResult) {
      void initializePosts(onboarding as Partial<OnboardingData>, archetypeResult);
    }
  }, [onboarding, archetypeResult, initializePosts]);

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

  const handleDelete = async (postId: string) => {
    const ok = await deletePost(postId);
    if (ok) showToast('success', 'Post excluído.');
    else showToast('error', 'Erro ao excluir post.');
  };

  const handleStatusChange = async (postId: string, status: 'draft' | 'published' | 'scheduled') => {
    const ok = await updatePostStatus(postId, status);
    if (!ok) showToast('error', 'Erro ao atualizar status.');
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
      {loading || isInitializing ? (
        <div className="posts-loading">
          <div className="loading-icon animate-float">✦</div>
          <p>{isInitializing ? 'Criando seus 12 primeiros posts personalizados com IA...' : 'Carregando posts...'}</p>
          {isInitializing && <p className="loading-sub">Isso pode levar alguns segundos</p>}
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
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
