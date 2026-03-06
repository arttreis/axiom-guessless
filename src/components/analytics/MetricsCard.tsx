import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  sub?: string;
  color?: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const target = value;
    const duration = 900;
    const start = Date.now();
    const from = ref.current;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
      else ref.current = target;
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display}</>;
}

export function MetricsCard({ label, value, icon: Icon, sub, color = 'var(--brand)' }: MetricsCardProps) {
  return (
    <div className="metrics-card">
      <div className="metrics-card-icon-wrap" style={{ background: `color-mix(in srgb, ${color} 14%, transparent)` }}>
        <Icon size={20} color={color} strokeWidth={2} />
      </div>
      <div className="metrics-card-body">
        <div className="metrics-card-value">
          {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
        </div>
        <div className="metrics-card-label">{label}</div>
        {sub && <div className="metrics-card-sub">{sub}</div>}
      </div>
    </div>
  );
}
