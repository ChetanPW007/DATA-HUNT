import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface CyberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const CyberInput = forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-rajdhani font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-input border-2 border-border rounded-lg',
            'font-mono-tech text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-primary focus:shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
            'transition-all duration-300',
            error && 'border-destructive focus:border-destructive focus:shadow-[0_0_20px_hsl(var(--destructive)/0.3)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive font-mono-tech">{error}</p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

export default CyberInput;
