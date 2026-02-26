import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { SAMPLE_POSTS } from '../constants/samplePosts';
import type { Post, GeneratedPost } from '../types';

export function usePosts() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data ?? []) as Post[]);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

  const insertSamplePosts = useCallback(async () => {
    if (!user) return;
    try {
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (count && count > 0) return; // Já tem posts

      const toInsert = SAMPLE_POSTS.map((p) => ({ ...p, user_id: user.id }));
      const { error } = await supabase.from('posts').insert(toInsert);
      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      console.error('Erro ao inserir posts de exemplo:', err);
    }
  }, [user, fetchPosts]);

  const savePost = useCallback(
    async (generated: GeneratedPost): Promise<Post | null> => {
      if (!user) return null;
      try {
        const newPost = {
          user_id: user.id,
          title: generated.title,
          content: generated.content,
          platform: generated.platform,
          type: generated.type,
          archetype: generated.archetype,
          status: 'draft' as const,
          likes: 0,
          engagement: '-',
        };
        const { data, error } = await supabase
          .from('posts')
          .insert([newPost])
          .select()
          .single();

        if (error) throw error;
        const saved = data as Post;
        setPosts((prev) => [saved, ...prev]);
        return saved;
      } catch (err) {
        console.error('Erro ao salvar post:', err);
        return null;
      }
    },
    [user]
  );

  return { posts, loading, fetchPosts, insertSamplePosts, savePost };
}
