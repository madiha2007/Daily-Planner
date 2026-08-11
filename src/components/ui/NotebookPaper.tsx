'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const JOURNAL_LINE_HEIGHT = 28;

export default function NotebookPaper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-peach-100/60 bg-[#fffdf8] shadow-inner overflow-hidden',
        className
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(
          transparent,
          transparent ${JOURNAL_LINE_HEIGHT - 1}px,
          rgba(180,140,100,0.28) ${JOURNAL_LINE_HEIGHT - 1}px,
          rgba(180,140,100,0.28) ${JOURNAL_LINE_HEIGHT}px
        )`,
        backgroundSize: `100% ${JOURNAL_LINE_HEIGHT}px`,
      }}
    >
      {/* red margin rule, like a real notebook page */}
      <div className="pointer-events-none absolute bottom-0 left-8 top-0 w-px bg-red-300/50 sm:left-10" />
      {children}
    </div>
  );
}