import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { SAMPLE_POSTS } from '../constants/samplePosts';
import type { Post, GeneratedPost } from '../types';

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

  const insertSamplePosts = useCallback(async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count && count > 0) return;

    const rows = SAMPLE_POSTS.map((p) => ({ ...p, user_id: user.id }));
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

  return { posts, loading, fetchPosts, insertSamplePosts, savePost };
}
