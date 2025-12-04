import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', size = 'md', glow = true, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-secondary',
      accent: 'bg-accent text-accent-foreground hover:bg-accent/90 border-accent',
      ghost: 'bg-transparent text-foreground hover:bg-muted border-border hover:border-primary',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 border-destructive',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const glowStyles = glow ? {
      primary: 'shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]',
      secondary: 'shadow-[0_0_20px_hsl(var(--secondary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--secondary)/0.6)]',
      accent: 'shadow-[0_0_20px_hsl(var(--accent)/0.4)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.6)]',
      ghost: 'hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
      destructive: 'shadow-[0_0_20px_hsl(var(--destructive)/0.4)] hover:shadow-[0_0_30px_hsl(var(--destructive)/0.6)]',
    } : {};

    return (
      <button
        ref={ref}
        className={cn(
          'relative font-orbitron font-bold tracking-wider uppercase rounded-lg border-2 transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          variants[variant],
          sizes[size],
          glow && glowStyles[variant],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

CyberButton.displayName = 'CyberButton';

export default CyberButton;
