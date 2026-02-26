import type { Post } from '../../types';

const PLATFORM_EMOJIS: Record<string, string> = {
  Instagram: '📸',
  LinkedIn: '💼',
  'Twitter/X': '𝕏',
  YouTube: '▶',
};

const STATUS_COLORS: Record<string, string> = {
  published: '#1A936F',
  draft: '#A0A0B0',
  scheduled: '#4D96FF',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'Publicado',
  draft: 'Rascunho',
  scheduled: 'Agendado',
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const statusColor = STATUS_COLORS[post.status] ?? '#A0A0B0';

  return (
    <div className="post-card">
      {/* Topo */}
      <div className="post-card-top">
        <div className="post-platform">
          <span>{PLATFORM_EMOJIS[post.platform] ?? '📄'}</span>
          <span className="post-platform-name">{post.platform}</span>
          <span className="post-type">{post.type}</span>
        </div>
        <div
          className="post-status-badge"
          style={{ color: statusColor, background: `${statusColor}22`, borderColor: `${statusColor}44` }}
        >
          {STATUS_LABELS[post.status] ?? post.status}
        </div>
      </div>

      {/* Corpo */}
      <div className="post-card-body">
        <h4 className="post-title">{post.title}</h4>
        <p className="post-content-preview">{post.content}</p>
      </div>

      {/* Rodapé */}
      <div className="post-card-footer">
        <div className="post-footer-left">
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
          {post.archetype && (
            <span className="post-archetype">· {post.archetype}</span>
          )}
        </div>
        <div className="post-footer-right">
          <span className="post-likes">♡ {post.likes}</span>
          <span className="post-engagement">{post.engagement}</span>
        </div>
      </div>
    </div>
  );
}
