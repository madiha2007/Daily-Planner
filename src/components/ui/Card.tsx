import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'button';
}

export default function Card({ children, className, onClick, as = 'div' }: CardProps) {
  const Comp = as as any;
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-neutral-200 bg-white p-5 shadow-soft transition-all',
        onClick && 'cursor-pointer hover:shadow-card hover:-translate-y-0.5 text-left w-full',
        className
      )}
    >
      {children}
    </Comp>
  );
}
