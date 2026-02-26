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
    { label: 'Total', value: total, color: '#FF922B' },
    { label: 'Publicados', value: published, color: '#1A936F' },
    { label: 'Rascunhos', value: drafts, color: '#A0A0B0' },
    { label: 'Agendados', value: scheduled, color: '#4D96FF' },
  ];

  return (
    <div className="post-stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-value" style={{ color: stat.color }}>
            {stat.value}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
