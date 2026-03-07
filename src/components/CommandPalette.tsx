import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sparkles, BarChart2, User, X, Search, FileText } from 'lucide-react';
import type { Post } from '../types';

const NAV_COMMANDS = [
  { id: 'dashboard',  label: 'Relatório da Marca', icon: <LayoutDashboard size={16} />, to: '/dashboard' },
  { id: 'content',    label: 'Conteúdo',           icon: <Sparkles size={16} />,        to: '/dashboard/content' },
  { id: 'analytics',  label: 'Analytics',          icon: <BarChart2 size={16} />,       to: '/dashboard/analytics' },
  { id: 'account',    label: 'Minha Conta',        icon: <User size={16} />,            to: '/dashboard/account' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  posts?: Post[];
}

export function CommandPalette({ open, onClose, posts = [] }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.toLowerCase();
  const navFiltered = NAV_COMMANDS.filter(c => c.label.toLowerCase().includes(q));
  const postFiltered = query.length >= 2
    ? posts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q)
      ).slice(0, 4).map(p => ({
        id: p.id,
        label: p.title,
        sub: p.platform,
        icon: <FileText size={16} />,
        to: '/dashboard/content',
      }))
    : [];
  const filtered = [...navFiltered, ...postFiltered];

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, filtered.length - 1));
      if (e.key === 'ArrowUp')   setSelected(s => Math.max(s - 1, 0));
      if (e.key === 'Enter' && filtered[selected]) {
        navigate(filtered[selected].to);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, selected, navigate, onClose]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-panel" onClick={e => e.stopPropagation()}>
        <div className="cmd-header">
          <Search size={16} className="cmd-search-icon" />
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Navegar para..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="cmd-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="cmd-results">
          {postFiltered.length > 0 && navFiltered.length > 0 && query.length >= 2 && (
            <div className="cmd-section-label">Navegação</div>
          )}
          {filtered.length === 0 ? (
            <div className="cmd-empty">Nenhum resultado para "{query}"</div>
          ) : filtered.map((cmd, i) => {
            const isPostStart = i === navFiltered.length && postFiltered.length > 0;
            return (
              <>
                {isPostStart && <div key="posts-label" className="cmd-section-label">Posts</div>}
                <button
                  key={cmd.id}
                  className={`cmd-item${i === selected ? ' cmd-item--active' : ''}`}
                  onClick={() => { navigate(cmd.to); onClose(); }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <span className="cmd-item-icon">{cmd.icon}</span>
                  <span className="cmd-item-label">
                    {cmd.label}
                    {'sub' in cmd && (cmd as { sub?: string }).sub && <span className="cmd-item-sub"> · {(cmd as { sub?: string }).sub}</span>}
                  </span>
                  {i === selected && <kbd className="cmd-item-enter">↵</kbd>}
                </button>
              </>
            );
          })}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navegar</span>
          <span><kbd>↵</kbd> selecionar</span>
          <span><kbd>Esc</kbd> fechar</span>
        </div>
      </div>
    </div>
  );
}
