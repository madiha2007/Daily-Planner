import { useCallback } from 'react';

export function useScrollToSection() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add('ring-2', 'ring-emerald-400', 'ring-offset-4', 'ring-offset-neutral-50');
    window.setTimeout(() => {
      el.classList.remove('ring-2', 'ring-emerald-400', 'ring-offset-4', 'ring-offset-neutral-50');
    }, 900);
  }, []);
}
