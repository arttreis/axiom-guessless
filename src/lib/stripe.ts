// DEMO MODE — Stripe removido temporariamente para apresentação visual

export async function createCheckoutSession(
  _plan: 'starter' | 'pro' | 'agency',
  _userId: string,
  _userEmail: string,
): Promise<void> {
  return Promise.resolve();
}

export async function openCustomerPortal(_customerId: string): Promise<void> {
  return Promise.resolve();
}

export const PLAN_FEATURES = {
  starter: {
    name: 'Starter',
    price: 'R$97/mês',
    posts: '30 posts/mês',
    platforms: '2 plataformas',
    support: 'Suporte por email',
    extras: [] as string[],
  },
  pro: {
    name: 'Pro',
    price: 'R$197/mês',
    posts: '100 posts/mês',
    platforms: 'Todas as plataformas',
    support: 'Suporte prioritário',
    extras: ['Análise de concorrentes'],
  },
  agency: {
    name: 'Agency',
    price: 'R$497/mês',
    posts: 'Posts ilimitados',
    platforms: 'Todas as plataformas',
    support: 'Gerente dedicado',
    extras: ['Multi-marca', 'Acesso à API'],
  },
};
