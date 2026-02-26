export interface OnboardingData {
  brand_name: string;
  brand_meaning: string;
  brand_motivation: string;
  brand_description: string;
  how_operates: string;
  where_sells: string;
  products_services: string;
  current_moment: string;
  differentials: string;
  competitors: string;
  competitors_offer: string;
  audience_class: string;
  audience_gender: string;
  audience_age: string;
  who_are_clients: string;
  client_perception: string;
  keywords: string;
  brand_personality_yes: string;
  brand_personality_no: string;
  colors_yes: string;
  colors_no: string;
  brands_admire: string;
}

export interface ArchetypeResult {
  scores: Record<string, number>;
  primary_archetype: string;
  secondary_archetype: string;
  analysis: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter/X' | 'YouTube';
  type: string;
  archetype: string;
  status: 'draft' | 'published' | 'scheduled';
  likes: number;
  engagement: string;
  hashtags?: string[];
  tip?: string;
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  plan: 'trial' | 'starter' | 'pro' | 'agency';
  stripe_customer_id: string;
  stripe_subscription_id: string;
  subscription_status: string;
  trial_ends_at: string;
  created_at: string;
  updated_at: string;
}

export interface GeneratedPost {
  title: string;
  content: string;
  platform: 'Instagram' | 'LinkedIn' | 'Twitter/X' | 'YouTube';
  type: string;
  archetype: string;
  hashtags: string[];
  tip: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
