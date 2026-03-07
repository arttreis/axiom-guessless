import type { Post } from '../../types';

interface PostStatsProps {
  posts: Post[];
}

export function PostStats({ posts }: PostStatsProps) {
  const total = posts.length;
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;
  const scheduled = posts.filter((p) => p.status === 'scheduled').length;

  const stats = [
    { label: 'Total',      value: total     },
    { label: 'Publicados', value: published },
    { label: 'Rascunhos',  value: drafts    },
    { label: 'Agendados',  value: scheduled },
  ];

  return (
    <div className="post-stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-value">
            {stat.value}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
