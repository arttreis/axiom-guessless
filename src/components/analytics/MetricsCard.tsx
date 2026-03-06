interface MetricsCardProps {
  label: string;
  value: number | string;
  icon: string;
  sub?: string;
}

export function MetricsCard({ label, value, icon, sub }: MetricsCardProps) {
  return (
    <div className="metrics-card">
      <div className="metrics-card-icon">{icon}</div>
      <div className="metrics-card-body">
        <div className="metrics-card-value">{value}</div>
        <div className="metrics-card-label">{label}</div>
        {sub && <div className="metrics-card-sub">{sub}</div>}
      </div>
    </div>
  );
}
