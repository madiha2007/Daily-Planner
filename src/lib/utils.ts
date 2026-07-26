import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Derives a 0-4 intensity level from completed/total counts.
 * Never hardcode intensity - always compute it from real data.
 */
export function computeIntensity(completed: number, total: number): 0 | 1 | 2 | 3 | 4 {
  if (total === 0 || completed === 0) return 0;
  const ratio = completed / total;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
