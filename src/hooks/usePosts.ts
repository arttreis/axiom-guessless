import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Post, GeneratedPost, OnboardingData, ArchetypeResult } from '../types';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

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

    setIsInitializing(true);
    const res = await fetch('/api/generate-initial-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ onboarding, archetypeResult }),
    });

    if (!res.ok) {
      setIsInitializing(false);
      return;
    }

    const json = await res.json() as { posts: Omit<GeneratedPost, 'platform'>[] };
    if (!json.posts?.length) {
      setIsInitializing(false);
      return;
    }

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
    setIsInitializing(false);
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

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id);
    if (error) { console.error('Erro ao excluir post:', error); return false; }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    return true;
  }, []);

  const updatePostStatus = useCallback(async (
    postId: string,
    status: 'draft' | 'published' | 'scheduled',
  ): Promise<boolean> => {
    const user = useAuthStore.getState().user;
    if (!user) return false;
    const { error } = await supabase
      .from('posts')
      .update({ status })
      .eq('id', postId)
      .eq('user_id', user.id);
    if (error) { console.error('Erro ao atualizar status:', error); return false; }
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, status } : p));
    return true;
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, isInitializing, fetchPosts, initializePosts, savePost, deletePost, updatePostStatus };
}
