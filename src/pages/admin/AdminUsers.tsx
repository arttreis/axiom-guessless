import { useAdminUsers } from '../../hooks/useAdminUsers';
import { UserTable } from '../../components/admin/UserTable';
import { UserFilters } from '../../components/admin/UserFilters';

export function AdminUsers() {
  const { users, loading, search, setSearch, planFilter, setPlanFilter } = useAdminUsers();

  return (
    <div className="dashboard-content animate-fade-up">
      <div className="dashboard-header">
        <div className="dashboard-label">ADMIN</div>
        <h1 className="dashboard-brand-name">Usuários</h1>
      </div>

      <UserFilters
        search={search}
        onSearch={setSearch}
        planFilter={planFilter}
        onPlanFilter={setPlanFilter}
      />

      <UserTable users={users} loading={loading} />
    </div>
  );
}
