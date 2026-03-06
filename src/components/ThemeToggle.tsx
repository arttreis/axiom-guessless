import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      aria-label="Alternar tema"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
