import { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus, X } from 'lucide-react';
import { ContentGenerator } from '../components/content/ContentGenerator';
import { PostCard } from '../components/content/PostCard';
import { PostFilter, type FilterValue } from '../components/content/PostFilter';
import { PostStats } from '../components/content/PostStats';
import { usePosts } from '../hooks/usePosts';
import { useOnboarding } from '../hooks/useOnboarding';
import { showToast } from '../components/Toast';
import type { GeneratedPost, OnboardingData } from '../types';

type ViewMode = 'grid' | 'list';

export function Content() {
  const { posts, loading, isInitializing, savePost, initializePosts, deletePost, updatePostStatus } = usePosts();
  const { onboarding, archetypeResult } = useOnboarding();
  const [showGenerator, setShowGenerator] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('Todos');
  const [view, setView] = useState<ViewMode>('grid');

  useEffect(() => {
    if (onboarding && archetypeResult) {
      void initializePosts(onboarding as Partial<OnboardingData>, archetypeResult);
    }
  }, [onboarding, archetypeResult, initializePosts]);

  const filteredPosts = filter === 'Todos' ? posts : posts.filter(p => p.platform === filter);

  const handleGenerated = async (generated: GeneratedPost) => {
    const saved = await savePost(generated);
    if (saved) { showToast('success', 'Post gerado e salvo!'); setShowGenerator(false); }
    else showToast('error', 'Erro ao salvar post.');
  };

  const handleDelete = async (id: string) => {
    const ok = await deletePost(id);
    if (ok) showToast('success', 'Post excluído.');
    else showToast('error', 'Erro ao excluir post.');
  };

  const handleStatusChange = async (id: string, status: 'draft' | 'published' | 'scheduled') => {
    const ok = await updatePostStatus(id, status);
    if (!ok) showToast('error', 'Erro ao atualizar status.');
  };

  return (
    <div className="content-page animate-fade-up">
      <div className="content-header">
        <div>
          <div className="dashboard-label">CONTEÚDO</div>
          <h1 className="content-title">
            Seus Posts <span className="posts-count">({posts.length})</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Toggle view */}
          <div className="view-toggle">
            <button
              className={`view-btn${view === 'grid' ? ' view-btn--active' : ''}`}
              onClick={() => setView('grid')}
              title="Grade"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`view-btn${view === 'list' ? ' view-btn--active' : ''}`}
              onClick={() => setView('list')}
              title="Lista"
            >
              <List size={15} />
            </button>
          </div>
          <button
            className={showGenerator ? 'btn-outline' : 'btn-primary'}
            onClick={() => setShowGenerator(!showGenerator)}
          >
            {showGenerator ? <><X size={14} /> Fechar</> : <><Plus size={14} /> Gerar</>}
          </button>
        </div>
      </div>

      {showGenerator && (
        <ContentGenerator
          brandContext={onboarding ?? {}}
          primaryArchetype={archetypeResult?.primary_archetype ?? 'O Herói'}
          onGenerated={handleGenerated}
        />
      )}

      <PostStats posts={posts} />
      <PostFilter active={filter} onChange={setFilter} />

      {loading || isInitializing ? (
        <div className={view === 'grid' ? 'posts-grid' : 'posts-list'}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" style={{ height: 180 }} />)}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="posts-empty">
          <div className="empty-icon-wrap"><Plus size={28} /></div>
          <p className="empty-title">Nenhum post encontrado</p>
          <p className="empty-sub">Clique em "Gerar" para criar seu primeiro post com IA.</p>
        </div>
      ) : (
        <div className={view === 'grid' ? 'posts-grid' : 'posts-list'}>
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              listView={view === 'list'}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
