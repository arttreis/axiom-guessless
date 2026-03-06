import { ProfileForm } from '../components/account/ProfileForm';
import { PlanBadge } from '../components/account/PlanBadge';

export function Account() {
  return (
    <div className="dashboard-content animate-fade-up">
      <div className="dashboard-header">
        <div className="dashboard-label">CONTA</div>
        <h1 className="dashboard-brand-name">Minha Conta</h1>
      </div>

      <div className="account-grid">
        <ProfileForm />
        <PlanBadge />
      </div>
    </div>
  );
}
