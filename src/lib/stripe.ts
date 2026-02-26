import { loadStripe } from '@stripe/stripe-js';

const PRICE_IDS = {
  starter: import.meta.env.VITE_STRIPE_PRICE_STARTER as string,
  pro:     import.meta.env.VITE_STRIPE_PRICE_PRO as string,
  agency:  import.meta.env.VITE_STRIPE_PRICE_AGENCY as string,
};

export async function createCheckoutSession(
  plan: 'starter' | 'pro' | 'agency',
  userId: string,
  userEmail: string
) {
  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

  if (!stripe) {
    throw new Error('Falha ao carregar Stripe.');
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: PRICE_IDS[plan], quantity: 1 }],
    mode: 'subscription',
    successUrl: `${import.meta.env.VITE_APP_URL}/onboarding`,
    cancelUrl:  `${import.meta.env.VITE_APP_URL}/checkout`,
    clientReferenceId: userId,
    customerEmail: userEmail,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function openCustomerPortal(customerId: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-portal`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      }
    );
    const data = await response.json() as { url?: string; error?: string };
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error ?? 'Erro ao abrir portal do cliente.');
    }
  } catch (error) {
    console.error('Erro ao abrir portal Stripe:', error);
    throw error;
  }
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
