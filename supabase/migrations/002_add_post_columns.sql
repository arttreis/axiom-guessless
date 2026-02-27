-- ============================================
-- Migration 002: adicionar colunas hashtags e tip na tabela posts
-- ============================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tip TEXT;
