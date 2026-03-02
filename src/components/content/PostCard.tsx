import { useState } from 'react';
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

const STATUS_CYCLE: Array<'draft' | 'published' | 'scheduled'> = ['draft', 'published', 'scheduled'];

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  onStatusChange?: (postId: string, status: 'draft' | 'published' | 'scheduled') => void;
}

export function PostCard({ post, onDelete, onStatusChange }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLORS[post.status] ?? '#A0A0B0';

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    const currentIndex = STATUS_CYCLE.indexOf(post.status as 'draft' | 'published' | 'scheduled');
    const nextStatus = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    onStatusChange(post.id, nextStatus);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(post.id);
  };

  return (
    <div
      className={`post-card post-card--clickable${expanded ? ' post-card--expanded' : ''}`}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Topo */}
      <div className="post-card-top">
        <div className="post-platform">
          <span>{PLATFORM_EMOJIS[post.platform] ?? '📄'}</span>
          <span className="post-platform-name">{post.platform}</span>
          <span className="post-type">{post.type}</span>
        </div>
        <div className="post-card-top-right">
          <div
            className="post-status-badge post-status-badge--clickable"
            style={{ color: statusColor, background: `${statusColor}22`, borderColor: `${statusColor}44` }}
            onClick={handleStatusClick}
            title="Clique para alterar status"
          >
            {STATUS_LABELS[post.status] ?? post.status}
          </div>
          <button
            className="post-delete-btn"
            onClick={handleDelete}
            title="Excluir post"
            type="button"
          >
            ✕
          </button>
          <span className={`post-expand-icon${expanded ? ' post-expand-icon--open' : ''}`}>
            ›
          </span>
        </div>
      </div>

      {/* Corpo */}
      <div className="post-card-body">
        <h4 className="post-title">{post.title}</h4>
        <p className={`post-content-preview${expanded ? ' post-content-preview--expanded' : ''}`}>
          {post.content}
        </p>

        {expanded && (
          <div className="post-expanded-details">
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="post-hashtags">
                {post.hashtags.map((tag) => (
                  <span key={tag} className="post-hashtag">{tag}</span>
                ))}
              </div>
            )}
            {post.tip && (
              <div className="post-tip">
                <span className="post-tip-icon">💡</span>
                <span>{post.tip}</span>
              </div>
            )}
          </div>
        )}
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
