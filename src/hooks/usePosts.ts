// DEMO MODE — Estado local com posts de exemplo, sem Supabase
import { useState, useCallback } from 'react';
import { SAMPLE_POSTS } from '../constants/samplePosts';
import type { Post, GeneratedPost } from '../types';

const initialPosts: Post[] = SAMPLE_POSTS.map((p, i) => ({
  ...p,
  id: `sample-${i}`,
  user_id: 'demo-user-id',
}));

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading] = useState(false);

  const fetchPosts = useCallback(async () => {
    // DEMO MODE: posts já estão no estado local
  }, []);

  const insertSamplePosts = useCallback(async () => {
    // DEMO MODE: posts de exemplo já estão no estado inicial
  }, []);

  const savePost = useCallback(async (generated: GeneratedPost): Promise<Post | null> => {
    const newPost: Post = {
      id: `generated-${Date.now()}`,
      user_id: 'demo-user-id',
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
      created_at: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  }, []);

  return { posts, loading, fetchPosts, insertSamplePosts, savePost };
}
