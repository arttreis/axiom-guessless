interface PlatformBreakdownProps {
  byPlatform: Record<string, number>;
  total: number;
}

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: '#E1306C',
  LinkedIn: '#0077B5',
  'Twitter/X': '#1DA1F2',
  YouTube: '#FF0000',
};

export function PlatformBreakdown({ byPlatform, total }: PlatformBreakdownProps) {
  const entries = Object.entries(byPlatform).sort((a, b) => b[1] - a[1]);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Posts por Plataforma</h3>
      <div className="chart-bars">
        {entries.map(([platform, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={platform} className="chart-bar-row">
              <div className="chart-bar-label">{platform}</div>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: PLATFORM_COLORS[platform] ?? '#7C5CBF',
                  }}
                />
              </div>
              <div className="chart-bar-count">{count}</div>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="chart-empty">Nenhum post ainda.</p>
        )}
      </div>
    </div>
  );
}
