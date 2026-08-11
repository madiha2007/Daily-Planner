'use client';

import { useEffect } from 'react';
import { useScrollToSection } from '@/hooks/useScrollToSection';

const PENDING_SCROLL_KEY = 'pendingScrollSection';

export function usePendingScrollSection() {
  const scrollTo = useScrollToSection();

  useEffect(() => {
    const pending = sessionStorage.getItem(PENDING_SCROLL_KEY);
    if (pending) {
      sessionStorage.removeItem(PENDING_SCROLL_KEY);
      requestAnimationFrame(() => scrollTo(pending));
    }
  }, [scrollTo]);
}