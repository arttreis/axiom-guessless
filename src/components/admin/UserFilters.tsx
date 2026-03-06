interface UserFiltersProps {
  search: string;
  onSearch: (v: string) => void;
  planFilter: string;
  onPlanFilter: (v: string) => void;
}

const PLANS = ['all', 'trial', 'starter', 'pro', 'agency'];

export function UserFilters({ search, onSearch, planFilter, onPlanFilter }: UserFiltersProps) {
  return (
    <div className="admin-filters">
      <input
        className="form-input"
        placeholder="Buscar por nome ou e-mail..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <div className="filter-tabs">
        {PLANS.map((p) => (
          <button
            key={p}
            className={`filter-tab ${planFilter === p ? 'active' : ''}`}
            onClick={() => onPlanFilter(p)}
          >
            {p === 'all' ? 'Todos' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
