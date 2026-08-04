import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach-400 focus-visible:ring-offset-2',
          size === 'sm' ? 'px-4 py-1.5 text-sm' : 'px-5 py-2.5 text-sm',
          variant === 'primary' &&
            'bg-gradient-to-r from-peach-400 to-blush-400 text-white shadow-warm hover:brightness-105 active:brightness-95',
          variant === 'secondary' &&
            'bg-white text-cocoa-700 border border-peach-200 hover:bg-cream-100',
          variant === 'ghost' && 'bg-transparent text-cocoa-500 hover:bg-cream-200',
          variant === 'danger' && 'bg-red-300 text-white hover:bg-red-400',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
export default Button;

