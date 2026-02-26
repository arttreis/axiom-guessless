const PLATFORMS = ['Todos', 'Instagram', 'LinkedIn', 'Twitter/X', 'YouTube'] as const;
type FilterValue = (typeof PLATFORMS)[number];

interface PostFilterProps {
  active: FilterValue;
  onChange: (platform: FilterValue) => void;
}

export function PostFilter({ active, onChange }: PostFilterProps) {
  return (
    <div className="post-filter">
      {PLATFORMS.map((platform) => (
        <button
          key={platform}
          className={`filter-chip ${active === platform ? 'filter-chip--active' : ''}`}
          onClick={() => onChange(platform)}
        >
          {platform}
        </button>
      ))}
    </div>
  );
}

export type { FilterValue };
