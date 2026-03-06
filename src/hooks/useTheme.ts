import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

// Store singleton
let _theme: Theme = (() => {
  try { return (localStorage.getItem('axiom-theme') as Theme) ?? 'dark'; } catch { return 'dark'; }
})();
const _listeners = new Set<() => void>();

function _apply(t: Theme) {
  _theme = t;
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else document.documentElement.removeAttribute('data-theme');
  try { localStorage.setItem('axiom-theme', t); } catch {}
  _listeners.forEach(l => l());
}

// Apply initial theme
_apply(_theme);

export function useTheme() {
  const theme = useSyncExternalStore(
    cb => { _listeners.add(cb); return () => _listeners.delete(cb); },
    () => _theme,
  );
  const toggle = useCallback(() => _apply(_theme === 'dark' ? 'light' : 'dark'), []);
  return { theme, toggle };
}
