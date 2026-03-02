-- ============================================
-- Migration 003: unique constraints em user_id
-- para upsert funcionar corretamente
-- ============================================

ALTER TABLE onboarding_responses
  ADD CONSTRAINT onboarding_responses_user_id_unique UNIQUE (user_id);

ALTER TABLE archetype_results
  ADD CONSTRAINT archetype_results_user_id_unique UNIQUE (user_id);
