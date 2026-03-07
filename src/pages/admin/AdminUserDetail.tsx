import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Linkedin, Twitter, Youtube, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ArchetypeHero } from '../../components/dashboard/ArchetypeHero';
import { ArchetypeGrid } from '../../components/dashboard/ArchetypeGrid';
import type { Profile, OnboardingData, ArchetypeResult, Post } from '../../types';

const PLAN_COLORS: Record<string, string> = {
  trial:   '#FF922B',
  starter: '#7C5CBF',
  pro:     '#1A936F',
  agency:  '#3D6FF8',
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Instagram:  <Instagram  size={13} />,
  LinkedIn:   <Linkedin   size={13} />,
  'Twitter/X':<Twitter    size={13} />,
  YouTube:    <Youtube    size={13} />,
};

const STATUS_COLORS: Record<string, string> = {
  published: '#3D6FF8',
  draft:     '#7B96C4',
  scheduled: '#9BA8FF',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'Publicado',
  draft:     'Rascunho',
  scheduled: 'Agendado',
};

interface FieldProps { label: string; value?: string | null; }
function Field({ label, value }: FieldProps) {
  if (!value) return null;
  return (
    <div className="admin-detail-field">
      <span className="admin-detail-label">{label}</span>
      <span className="admin-detail-value">{value}</span>
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; }
function Section({ title, children }: SectionProps) {
  return (
    <div className="admin-detail-section">
      <h3 className="admin-detail-section-title">{title}</h3>
      <div className="admin-detail-fields">{children}</div>
    </div>
  );
}

export function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profile,    setProfile]    = useState<Profile | null>(null);
  const [onboarding, setOnboarding] = useState<Partial<OnboardingData> | null>(null);
  const [archetype,  setArchetype]  = useState<ArchetypeResult | null>(null);
  const [posts,      setPosts]      = useState<Post[]>([]);
  const [tab,        setTab]        = useState<'brand' | 'posts' | 'account'>('brand');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [
        { data: prof },
        { data: onb },
        { data: arch },
        { data: ps },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('onboarding_responses').select('*').eq('user_id', id).single(),
        supabase.from('archetype_results').select('*').eq('user_id', id).single(),
        supabase.from('posts').select('*').eq('user_id', id).order('created_at', { ascending: false }),
      ]);
      if (prof) setProfile(prof as Profile);
      if (onb)  setOnboarding(onb as Partial<OnboardingData>);
      if (arch) setArchetype(arch as ArchetypeResult);
      if (ps)   setPosts(ps as Post[]);
      setLoading(false);
    };
    void load();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-screen">
        <p className="loading-text">AXIOM</p>
        <p className="loading-sub">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="dashboard-content">
        <p style={{ color: 'var(--text-muted)' }}>Usuário não encontrado.</p>
        <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/admin/users')}>
          Voltar
        </button>
      </div>
    );
  }

  const brandName = onboarding?.brand_name ?? profile.name ?? profile.email;

  return (
    <div className="dashboard-content animate-fade-up">
      {/* Header */}
      <div className="admin-detail-header">
        <button className="admin-back-btn" onClick={() => navigate('/admin/users')}>
          <ArrowLeft size={15} /> Usuários
        </button>
        <div>
          <div className="dashboard-label">ADMIN · ASSINANTE</div>
          <h1 className="dashboard-brand-name">{brandName}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            <span className="plan-badge" style={{
              background: `${PLAN_COLORS[profile.plan] ?? '#888'}22`,
              color: PLAN_COLORS[profile.plan] ?? '#888',
            }}>
              {profile.plan}
            </span>
            <span className="post-status-badge" style={{
              color: profile.subscription_status === 'active' ? '#4ade80' : '#f87171',
              background: profile.subscription_status === 'active' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
              borderColor: profile.subscription_status === 'active' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)',
            }}>
              {profile.subscription_status === 'active' ? 'Ativo' : profile.subscription_status}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{profile.email}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-detail-tabs">
        {(['brand', 'posts', 'account'] as const).map(t => (
          <button
            key={t}
            className={`admin-detail-tab${tab === t ? ' admin-detail-tab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'brand'   && 'Relatório de Marca'}
            {t === 'posts'   && `Posts (${posts.length})`}
            {t === 'account' && 'Conta'}
          </button>
        ))}
      </div>

      {/* TAB: Relatório de Marca */}
      {tab === 'brand' && (
        <div>
          {archetype ? (
            <>
              <ArchetypeHero result={archetype} />
              <div style={{ marginTop: '1.5rem' }}>
                <ArchetypeGrid result={archetype} />
              </div>
              {archetype.analysis && (
                <div className="ai-analysis-card" style={{ marginTop: '1.5rem' }}>
                  <div className="ai-analysis-header">
                    <span className="ai-analysis-title">Análise da marca</span>
                  </div>
                  <p className="ai-analysis-text">{archetype.analysis}</p>
                </div>
              )}
            </>
          ) : (
            <p className="admin-detail-empty">Arquétipo ainda não calculado.</p>
          )}

          {onboarding ? (
            <div className="admin-detail-onboarding">
              <Section title="Identificação e Propósito">
                <Field label="Nome da marca"    value={onboarding.brand_name} />
                <Field label="Significado"      value={onboarding.brand_meaning} />
                <Field label="Motivação"        value={onboarding.brand_motivation} />
                <Field label="Descrição"        value={onboarding.brand_description} />
              </Section>
              <Section title="Operação e Mercado">
                <Field label="Como opera"           value={onboarding.how_operates} />
                <Field label="Onde vende"            value={onboarding.where_sells} />
                <Field label="Produtos / Serviços"   value={onboarding.products_services} />
                <Field label="Momento atual"         value={onboarding.current_moment} />
                <Field label="Diferenciais"          value={onboarding.differentials} />
              </Section>
              <Section title="Concorrência">
                <Field label="Concorrentes"           value={onboarding.competitors} />
                <Field label="O que oferecem"         value={onboarding.competitors_offer} />
              </Section>
              <Section title="Público-Alvo">
                <Field label="Classe"                value={onboarding.audience_class} />
                <Field label="Gênero"               value={onboarding.audience_gender} />
                <Field label="Idade"                value={onboarding.audience_age} />
                <Field label="Quem são os clientes" value={onboarding.who_are_clients} />
                <Field label="Percepção do cliente" value={onboarding.client_perception} />
              </Section>
              <Section title="Branding e Identidade">
                <Field label="Palavras-chave"        value={onboarding.keywords} />
                <Field label="Personalidade (sim)"   value={onboarding.brand_personality_yes} />
                <Field label="Personalidade (não)"   value={onboarding.brand_personality_no} />
                <Field label="Cores (sim)"           value={onboarding.colors_yes} />
                <Field label="Cores (não)"           value={onboarding.colors_no} />
                <Field label="Marcas que admira"     value={onboarding.brands_admire} />
              </Section>
            </div>
          ) : (
            <p className="admin-detail-empty" style={{ marginTop: '1.5rem' }}>Onboarding não realizado.</p>
          )}
        </div>
      )}

      {/* TAB: Posts */}
      {tab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="posts-empty">
              <div className="empty-icon-wrap"><FileText size={24} /></div>
              <p className="empty-title">Nenhum post ainda.</p>
            </div>
          ) : (
            <div className="posts-list">
              {posts.map(post => {
                const statusColor = STATUS_COLORS[post.status] ?? '#7B96C4';
                return (
                  <div key={post.id} className="post-list-row">
                    <div className="post-list-main">
                      <span className="post-platform-icon">{PLATFORM_ICONS[post.platform]}</span>
                      <div className="post-list-body" style={{ flex: 1 }}>
                        <span className="post-list-title">{post.title}</span>
                        <p className="post-list-content">{post.content}</p>
                        {post.hashtags && post.hashtags.length > 0 && (
                          <p style={{ fontSize: '0.78rem', color: 'var(--brand-mid)', marginTop: '0.25rem' }}>
                            {post.hashtags.join(' ')}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                        <span className="post-status-badge" style={{
                          color: statusColor,
                          background: `${statusColor}18`,
                          borderColor: `${statusColor}33`,
                        }}>
                          {STATUS_LABELS[post.status] ?? post.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(post.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: Conta */}
      {tab === 'account' && (
        <div className="account-grid">
          <div className="account-card">
            <h3 className="account-section-title">Informações Pessoais</h3>
            <div className="admin-detail-fields">
              <Field label="Nome"          value={profile.name} />
              <Field label="E-mail"        value={profile.email} />
              <Field label="Membro desde"  value={new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <Field label="Última atualização" value={new Date(profile.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <Field label="Papel (role)"  value={profile.role} />
            </div>
          </div>

          <div className="account-card">
            <h3 className="account-section-title">Assinatura</h3>
            <div className="admin-detail-fields">
              <div className="admin-detail-field">
                <span className="admin-detail-label">Plano</span>
                <span className="plan-badge" style={{
                  background: `${PLAN_COLORS[profile.plan] ?? '#888'}22`,
                  color: PLAN_COLORS[profile.plan] ?? '#888',
                }}>
                  {profile.plan}
                </span>
              </div>
              <Field label="Status"                value={profile.subscription_status} />
              <Field label="Trial expira em"       value={profile.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString('pt-BR') : undefined} />
              <Field label="Stripe Customer ID"    value={profile.stripe_customer_id} />
              <Field label="Stripe Subscription"   value={profile.stripe_subscription_id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
