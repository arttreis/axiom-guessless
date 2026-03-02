import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Post, GeneratedPost, OnboardingData, ArchetypeResult } from '../types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setPosts(data as Post[]);
    } finally {
      setLoading(false);
    }
  }, []);

  const initializePosts = useCallback(async (
    onboarding: Partial<OnboardingData>,
    archetypeResult: ArchetypeResult,
  ) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count && count > 0) return;

    const res = await fetch('/api/generate-initial-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding, archetypeResult }),
    });

    if (!res.ok) return;

    const json = await res.json() as { posts: Omit<GeneratedPost, 'platform'>[] };
    if (!json.posts?.length) return;

    const rows = json.posts.map((p) => ({
      ...p,
      platform: 'Instagram' as const,
      user_id: user.id,
      status: 'draft' as const,
      likes: 0,
      engagement: '-',
    }));

    const { data } = await supabase.from('posts').insert(rows).select();
    if (data) setPosts(data as Post[]);
  }, []);

  const savePost = useCallback(async (generated: GeneratedPost): Promise<Post | null> => {
    const user = useAuthStore.getState().user;
    if (!user) return null;

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title: generated.title,
        content: generated.content,
        platform: generated.platform,
        type: generated.type,
        archetype: generated.archetype,
        status: 'draft',
        likes: 0,
        engagement: '-',
        hashtags: generated.hashtags,
        tip: generated.tip,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar post:', error);
      return null;
    }

    const saved = data as Post;
    setPosts((prev) => [saved, ...prev]);
    return saved;
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, fetchPosts, initializePosts, savePost };
}
