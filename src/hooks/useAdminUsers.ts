import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export function useAdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setUsers(data as Profile[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      search === '' ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const stats = {
    total: users.length,
    trial: users.filter((u) => u.plan === 'trial').length,
    starter: users.filter((u) => u.plan === 'starter').length,
    pro: users.filter((u) => u.plan === 'pro').length,
    agency: users.filter((u) => u.plan === 'agency').length,
  };

  return { users: filtered, loading, stats, search, setSearch, planFilter, setPlanFilter, refetch: fetchUsers };
}
