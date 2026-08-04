import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: ReactNode;
  tone?: 'neutral' | 'peach' | 'blush' | 'cream' | 'red';
}

const toneStyles: Record<NonNullable<BadgeProps['tone']>, string> = {
  neutral: 'bg-cream-200 text-cocoa-600',
  peach: 'bg-peach-200 text-peach-700',
  blush: 'bg-blush-200 text-blush-400',
  cream: 'bg-cream-300 text-cocoa-700',
  red: 'bg-red-100 text-red-500',
};

export default function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', toneStyles[tone])}>
      {children}
    </span>
  );
}
