import { useState, useEffect } from 'react';
import { LayoutGrid, List, Plus, X, Trash2, CheckSquare, AlertCircle } from 'lucide-react';
import { ContentGenerator } from '../components/content/ContentGenerator';
import { PostCard } from '../components/content/PostCard';
import { PostFilter, type FilterValue } from '../components/content/PostFilter';
import { PostStats } from '../components/content/PostStats';
import { usePosts } from '../hooks/usePosts';
import { useOnboarding } from '../hooks/useOnboarding';
import { showToast } from '../components/Toast';
import type { GeneratedPost, OnboardingData, Post } from '../types';

type ViewMode = 'grid' | 'list';

export function Content() {
  const { posts, loading, isInitializing, savePost, initializePosts, deletePost, updatePostStatus } = usePosts();
  const { onboarding, archetypeResult } = useOnboarding();
  const [showGenerator, setShowGenerator] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('Todos');
  const [view, setView] = useState<ViewMode>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [regeneratingPost, setRegeneratingPost] = useState<Post | null>(null);

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

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map(id => deletePost(id)));
    showToast('success', `${ids.length} post(s) excluído(s).`);
    setSelectedIds(new Set());
  };

  const handleBulkPublish = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(ids.map(id => updatePostStatus(id, 'published')));
    showToast('success', `${ids.length} post(s) publicado(s).`);
    setSelectedIds(new Set());
  };

  const handleRegenerate = (post: Post) => {
    setRegeneratingPost(post);
    setShowGenerator(true);
  };

  const onboardingData = onboarding as Partial<Record<string, string>> | null;
  const onboardingIncomplete = onboardingData && (!onboardingData.brand_name || !onboardingData.brand_description);

  return (
    <div className="content-page animate-fade-up">
      {onboardingIncomplete && (
        <div className="onboarding-banner">
          <AlertCircle size={16} className="onboarding-banner-icon" />
          <span>Complete seu perfil de marca para posts mais personalizados.</span>
          <a href="/onboarding" className="onboarding-banner-link">Completar agora</a>
        </div>
      )}

      <div className="content-header">
        <div>
          <div className="dashboard-label">CONTEÚDO</div>
          <h1 className="content-title">
            Seus Posts <span className="posts-count">({posts.length})</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {selectedIds.size > 0 && (
            <div className="bulk-action-bar">
              <span className="bulk-count">{selectedIds.size} selecionado(s)</span>
              <button className="bulk-btn bulk-btn--publish" onClick={() => void handleBulkPublish()}>
                <CheckSquare size={13} /> Publicar
              </button>
              <button className="bulk-btn bulk-btn--delete" onClick={() => void handleBulkDelete()}>
                <Trash2 size={13} /> Excluir
              </button>
              <button className="bulk-btn" onClick={() => setSelectedIds(new Set())}>
                <X size={13} />
              </button>
            </div>
          )}
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
            onClick={() => { setShowGenerator(!showGenerator); if (showGenerator) setRegeneratingPost(null); }}
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
          regeneratePost={regeneratingPost ?? undefined}
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
              selected={selectedIds.has(post.id)}
              onSelect={handleSelect}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
