import { useState } from 'react';
import { Instagram, Linkedin, Twitter, Youtube, Trash2, ChevronRight, Hash, Lightbulb, Copy, Check, RefreshCw } from 'lucide-react';
import type { Post } from '../../types';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram size={13} />,
  LinkedIn:  <Linkedin  size={13} />,
  'Twitter/X': <Twitter size={13} />,
  YouTube:   <Youtube  size={13} />,
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Publicado', color: '#3D6FF8', bg: 'rgba(61,111,248,0.12)' },
  draft:     { label: 'Rascunho', color: '#7B96C4', bg: 'rgba(123,150,196,0.10)' },
  scheduled: { label: 'Agendado', color: '#9BA8FF', bg: 'rgba(155,168,255,0.12)' },
};

const STATUS_CYCLE: Array<'draft' | 'published' | 'scheduled'> = ['draft', 'published', 'scheduled'];

interface PostCardProps {
  post: Post;
  listView?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'draft' | 'published' | 'scheduled') => void;
  onRegenerate?: (post: Post) => void;
}

export function PostCard({ post, listView, selected, onSelect, onDelete, onStatusChange, onRegenerate }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.draft;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${post.title}\n\n${post.content}${post.hashtags?.length ? '\n\n' + post.hashtags.join(' ') : ''}`;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRegenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegenerate?.(post);
  };

  const handleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onStatusChange) return;
    const i = STATUS_CYCLE.indexOf(post.status as 'draft' | 'published' | 'scheduled');
    onStatusChange(post.id, STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length]);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(post.id);
  };

  if (listView) {
    return (
      <div className={`post-list-row${expanded ? ' post-list-row--expanded' : ''}`} onClick={() => setExpanded(v => !v)}>
        <div className="post-list-main">
          <span className="post-platform-icon">{PLATFORM_ICONS[post.platform] ?? null}</span>
          <div className="post-list-body">
            <span className="post-list-title">{post.title}</span>
            {expanded && <p className="post-list-content">{post.content}</p>}
          </div>
          <span
            className="post-status-badge post-status-badge--clickable"
            style={{ color: cfg.color, background: cfg.bg, borderColor: `${cfg.color}33` }}
            onClick={handleStatus}
          >
            {cfg.label}
          </span>
          <button className="post-delete-btn" onClick={handleDelete} title="Excluir">
            <Trash2 size={13} />
          </button>
          <ChevronRight size={15} className={`post-list-chevron${expanded ? ' post-list-chevron--open' : ''}`} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`post-card post-card--clickable${expanded ? ' post-card--expanded' : ''}`}
      onClick={() => setExpanded(v => !v)}
    >
      <div className="post-card-top">
        <div className="post-platform">
          <span className="post-platform-icon">{PLATFORM_ICONS[post.platform] ?? null}</span>
          <span className="post-platform-name">{post.platform}</span>
          <span className="post-type">{post.type}</span>
        </div>
        <div className="post-card-top-right">
          <span
            className="post-status-badge post-status-badge--clickable"
            style={{ color: cfg.color, background: cfg.bg, borderColor: `${cfg.color}33` }}
            onClick={handleStatus}
            title="Clique para mudar status"
          >
            {cfg.label}
          </span>
          <button className="post-delete-btn" onClick={handleDelete} title="Excluir">
            <Trash2 size={13} />
          </button>
          <ChevronRight
            size={15}
            className={`post-expand-icon${expanded ? ' post-expand-icon--open' : ''}`}
            style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
        </div>
      </div>

      <div className="post-card-body">
        <h4 className="post-title">{post.title}</h4>
        <p className={`post-content-preview${expanded ? ' post-content-preview--expanded' : ''}`}>
          {post.content}
        </p>
        {expanded && (
          <div className="post-expanded-details">
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="post-hashtags">
                {post.hashtags.map(tag => (
                  <span key={tag} className="post-hashtag">
                    <Hash size={10} />{tag.replace('#', '')}
                  </span>
                ))}
              </div>
            )}
            {post.tip && (
              <div className="post-tip">
                <Lightbulb size={14} className="post-tip-icon" />
                <span>{post.tip}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-card-footer">
        <div className="post-footer-left">
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
          {post.archetype && <span className="post-archetype">· {post.archetype}</span>}
        </div>
        <div className="post-footer-right">
          {onSelect && (
            <input
              type="checkbox"
              className="post-select-checkbox"
              checked={selected ?? false}
              onChange={e => { e.stopPropagation(); onSelect(post.id); }}
              onClick={e => e.stopPropagation()}
              title="Selecionar"
            />
          )}
          {onRegenerate && (
            <button className="post-action-btn" onClick={handleRegenerate} title="Regenerar com IA">
              <RefreshCw size={12} />
            </button>
          )}
          <button className="post-action-btn" onClick={handleCopy} title="Copiar post">
            {copied ? <Check size={12} style={{ color: '#4ade80' }} /> : <Copy size={12} />}
          </button>
        </div>
      </div>
    </div>
  );
}
