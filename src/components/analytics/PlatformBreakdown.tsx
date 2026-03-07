interface PlatformBreakdownProps {
  byPlatform: Record<string, number>;
  total: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: '#6B8FFF',
  LinkedIn:  '#3D6FF8',
  'Twitter/X': '#9BA8FF',
  YouTube:   '#4B7BFF',
};

const RECOMMENDED: Record<string, number> = {
  Instagram: 40,
  LinkedIn: 30,
  'Twitter/X': 20,
  YouTube: 10,
};

const ALL_PLATFORMS = ['Instagram', 'LinkedIn', 'Twitter/X', 'YouTube'];

export function PlatformBreakdown({ byPlatform, total }: PlatformBreakdownProps) {
  const entries = ALL_PLATFORMS.map(p => [p, byPlatform[p] ?? 0] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Posts por Plataforma</h3>
      <div className="chart-bars">
        {entries.map(([platform, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const rec = RECOMMENDED[platform] ?? 25;
          const color = PLATFORM_COLORS[platform] ?? '#6B8FFF';
          return (
            <div key={platform} className="chart-bar-row">
              <div className="chart-bar-label">{platform}</div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill chart-bar-fill--animated"
                  style={{ width: `${pct}%`, background: color }}
                />
                <div
                  className="chart-bar-recommended"
                  style={{ left: `${rec}%` }}
                  title={`Recomendado: ${rec}%`}
                />
              </div>
              <div className="chart-bar-count">{count}</div>
            </div>
          );
        })}
        {total === 0 && (
          <p className="chart-empty">Nenhum post ainda.</p>
        )}
      </div>
      <div className="chart-legend">
        <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#3D6FF8' }} />Seus posts</span>
        <span className="chart-legend-item"><span className="chart-legend-line" />Recomendado</span>
      </div>
    </div>
  );
}
