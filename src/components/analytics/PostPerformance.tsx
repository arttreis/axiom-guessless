import type { Post } from '../../types';

interface PostPerformanceProps {
  posts: Post[];
}

const STATUS_LABELS: Record<string, string> = {
  published: 'Publicado',
  draft: 'Rascunho',
  scheduled: 'Agendado',
};

export function PostPerformance({ posts }: PostPerformanceProps) {
  return (
    <div className="chart-card">
      <h3 className="chart-title">Posts Recentes</h3>
      <div className="post-perf-list">
        {posts.map((post) => (
          <div key={post.id} className="post-perf-row">
            <div className="post-perf-info">
              <div className="post-perf-title">{post.title}</div>
              <div className="post-perf-meta">
                {post.platform} · {post.archetype}
              </div>
            </div>
            <span className={`status-badge status-${post.status}`}>
              {STATUS_LABELS[post.status] ?? post.status}
            </span>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="chart-empty">Nenhum post ainda.</p>
        )}
      </div>
    </div>
  );
}
