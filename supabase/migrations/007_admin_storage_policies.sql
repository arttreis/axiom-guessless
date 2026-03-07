-- ============================================
-- Migration 007: Admin pode fazer upload/update em qualquer pasta do bucket avatars
-- ============================================

-- Admin pode fazer upload na pasta de qualquer usuário
CREATE POLICY "Admins podem fazer upload de qualquer avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode substituir o avatar de qualquer usuário
CREATE POLICY "Admins podem atualizar qualquer avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin pode deletar o avatar de qualquer usuário
CREATE POLICY "Admins podem deletar qualquer avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
