import { useEffect } from 'react';
import { useUIStore } from '@/stores/useUIStore';

/**
 * Observes all elements matching `section[id]` inside the dashboard main
 * content and updates the active section in useUIStore as the user scrolls.
 * Mount this once at the dashboard shell level.
 */
export function useIntersectionSection(sectionIds: string[]) {
  const setActiveSection = useUIStore((s) => s.setActiveSection);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, setActiveSection]);
}
