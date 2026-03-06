import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Post } from '../types';

export interface AnalyticsData {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  byPlatform: Record<string, number>;
  byArchetype: Record<string, number>;
  recentPosts: Post[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const { data: posts } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!posts) return;

        const byPlatform: Record<string, number> = {};
        const byArchetype: Record<string, number> = {};

        for (const post of posts) {
          byPlatform[post.platform] = (byPlatform[post.platform] ?? 0) + 1;
          byArchetype[post.archetype] = (byArchetype[post.archetype] ?? 0) + 1;
        }

        setData({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p) => p.status === 'published').length,
          draftPosts: posts.filter((p) => p.status === 'draft').length,
          scheduledPosts: posts.filter((p) => p.status === 'scheduled').length,
          byPlatform,
          byArchetype,
          recentPosts: posts.slice(0, 5),
        });
      } finally {
        setLoading(false);
      }
    };

    void fetch();
  }, [user]);

  return { data, loading };
}
