import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'accent';
  animate?: boolean;
}

const CyberCard = ({ children, className, glowColor = 'primary', animate = false }: CyberCardProps) => {
  const glowClasses = {
    primary: 'border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.2),inset_0_0_30px_hsl(var(--primary)/0.05)]',
    secondary: 'border-secondary/30 shadow-[0_0_30px_hsl(var(--secondary)/0.2),inset_0_0_30px_hsl(var(--secondary)/0.05)]',
    accent: 'border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.2),inset_0_0_30px_hsl(var(--accent)/0.05)]',
  };

  return (
    <div className={cn(
      'relative bg-card/80 backdrop-blur-sm rounded-xl border-2 p-6',
      glowClasses[glowColor],
      animate && 'animate-glow-pulse',
      className
    )}>
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />
      
      {children}
    </div>
  );
};

export default CyberCard;
