import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gmuLogo from '@/assets/gmu_logo.png';
import saLogo from '@/assets/sa_logo.png';

interface HeaderProps {
  showLogout?: boolean;
}

const Header = ({ showLogout = false }: HeaderProps) => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full py-3 px-3 md:py-4 md:px-6 border-b border-border/30">
      <div className="max-w-7xl mx-auto">
        {/* Top row with logos */}
        <div className="flex items-center justify-between">
          {/* Left Logo */}
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg border-glow flex items-center justify-center bg-card/50 overflow-hidden flex-shrink-0">
            <img src={gmuLogo} alt="GMU Logo" className="w-full h-full object-contain p-1 md:p-2" />
          </div>

          {/* Center Title */}
          <div className="flex flex-col items-center px-2">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-cinzel font-black tracking-wider text-foreground animate-pulse-glow whitespace-nowrap drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]">
              IGNITRON 2K25
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm font-cinzel text-accent font-semibold tracking-[0.15em] md:tracking-[0.2em] mt-0.5">
              Engineer&apos;s Eye
            </p>
          </div>

          {/* Right Logo */}
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-lg border-glow flex items-center justify-center bg-card/50 overflow-hidden flex-shrink-0">
            <img src={saLogo} alt="SA Logo" className="w-full h-full object-contain p-1 md:p-2" />
          </div>
        </div>

        {/* Logout row - only for admin */}
        {showLogout && admin && (
          <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/20">
            <span className="text-sm text-muted-foreground font-mono-tech">
              Admin: {admin.admin_name}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
