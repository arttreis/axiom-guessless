import { useAuthStore } from '../../store/authStore';

const PLAN_LABELS: Record<string, string> = {
  trial: 'Trial',
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
};

export function PlanBadge() {
  const { profile } = useAuthStore();

  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="account-card">
      <h3 className="account-section-title">Plano Atual</h3>
      <div className="plan-info-row">
        <span className="plan-name-large">{PLAN_LABELS[profile?.plan ?? 'trial']}</span>
        <span
          className="plan-badge"
          style={{
            backgroundColor: profile?.subscription_status === 'active' ? '#1A936F22' : '#FF922B22',
            color: profile?.subscription_status === 'active' ? '#1A936F' : '#FF922B',
          }}
        >
          {profile?.subscription_status === 'active' ? 'Ativo' : 'Trial'}
        </span>
      </div>
      {trialDaysLeft !== null && profile?.plan === 'trial' && (
        <p className="plan-trial-info">{trialDaysLeft} dias restantes no período gratuito.</p>
      )}
      <button className="btn-portal" onClick={() => {}}>
        Gerenciar assinatura
      </button>
    </div>
  );
}
