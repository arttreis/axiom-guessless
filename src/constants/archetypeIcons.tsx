import { Sun, Compass, BookOpen, Zap, Flame, Sparkles, Users, Heart, Smile, Shield, Palette, Crown } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';

type IconComponent = FC<LucideProps>;

export const ARCHETYPE_ICONS: Record<string, IconComponent> = {
  'O Inocente':    Sun,
  'O Explorador':  Compass,
  'O Sábio':       BookOpen,
  'O Herói':       Zap,
  'O Fora-da-Lei': Flame,
  'O Mago':        Sparkles,
  'O Cara Comum':  Users,
  'O Amante':      Heart,
  'O Bobo':        Smile,
  'O Cuidador':    Shield,
  'O Criador':     Palette,
  'O Governante':  Crown,
};

export function ArchetypeIcon({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  const Icon = ARCHETYPE_ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}
