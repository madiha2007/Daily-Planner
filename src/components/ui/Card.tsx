import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardTone = 'white' | 'cream' | 'peach' | 'blush' | 'gradient';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'button';
  tone?: CardTone;
}

const toneClasses: Record<CardTone, string> = {
  white: 'bg-white text-cocoa-800 border border-peach-100',
  cream: 'bg-cream-100 text-cocoa-800 border border-peach-200',
  peach: 'bg-peach-200 text-cocoa-800 border border-peach-300',
  blush: 'bg-blush-100 text-cocoa-800 border border-blush-200',
  gradient: 'bg-gradient-to-br from-peach-300 to-blush-300 text-white border border-peach-400',
};

export default function Card({ children, className, onClick, as = 'div', tone = 'white' }: CardProps) {
  const Comp = as as any;
  return (
    <Comp
      onClick={onClick}
      className={cn(
        'rounded-3xl p-5 shadow-soft transition-all',
        toneClasses[tone],
        onClick && 'cursor-pointer text-left w-full hover:-translate-y-0.5 hover:shadow-card active:translate-y-0',
        className
      )}
    >
      {children}
    </Comp>
  );
}
