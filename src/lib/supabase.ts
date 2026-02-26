// DEMO MODE — Supabase removido temporariamente para apresentação visual

/* eslint-disable @typescript-eslint/no-explicit-any */
function createQueryBuilder(): any {
  const builder: any = {};
  builder.select = () => builder;
  builder.eq = () => builder;
  builder.order = () => builder;
  builder.single = () => Promise.resolve({ data: null, error: null });
  builder.maybeSingle = () => Promise.resolve({ data: null, error: null });
  builder.insert = () => builder;
  builder.upsert = () => Promise.resolve({ data: null, error: null });
  builder.then = (resolve: (v: any) => void) =>
    resolve({ data: [], error: null, count: null });
  return builder;
}

export const supabase = {
  auth: {
    signUp: async (params: {
      email: string;
      password?: string;
      options?: { data?: { name?: string } };
    }) => ({
      data: {
        user: {
          id: 'demo-user-id',
          email: params.email,
          user_metadata: { name: params.options?.data?.name ?? 'Demo' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        },
        session: null,
      },
      error: null,
    }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: (_callback: unknown) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signOut: async () => ({ error: null }),
  },
  from: (_table: string) => createQueryBuilder(),
};
