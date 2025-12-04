import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LevelTitle from '@/components/LevelTitle';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const [lines, setLines] = useState({
    line1: 'Welcome to the ultimate treasure hunt!',
    line2: 'Test your skills across 8 challenging stages.',
    line3: 'Work as a team to decode locations and find solutions.',
    line4: 'May the best team win!',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['landing_line_1', 'landing_line_2', 'landing_line_3', 'landing_line_4']);

      if (data) {
        const settings: Record<string, string> = {};
        data.forEach(item => {
          settings[item.setting_key] = item.setting_value;
        });
        setLines({
          line1: settings.landing_line_1 || lines.line1,
          line2: settings.landing_line_2 || lines.line2,
          line3: settings.landing_line_3 || lines.line3,
          line4: settings.landing_line_4 || lines.line4,
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-8">
        <LevelTitle />
        
        {/* Info Container */}
        <CyberCard className="max-w-2xl w-full mb-8 md:mb-10 animate-fade-in" glowColor="primary">
          <div className="space-y-3 md:space-y-4 text-center">
            {loading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-base md:text-lg font-rajdhani text-foreground/90">{lines.line1}</p>
                <p className="text-base md:text-lg font-rajdhani text-foreground/90">{lines.line2}</p>
                <p className="text-base md:text-lg font-rajdhani text-foreground/90">{lines.line3}</p>
                <p className="text-base md:text-lg font-rajdhani text-accent font-semibold">{lines.line4}</p>
              </>
            )}
          </div>
        </CyberCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in w-full max-w-md sm:max-w-none sm:w-auto" style={{ animationDelay: '0.2s' }}>
          <CyberButton
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            Start Hunt
          </CyberButton>
          
          <CyberButton
            variant="ghost"
            size="lg"
            onClick={() => navigate('/admin-login')}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            Admin Panel
          </CyberButton>
        </div>

        {/* Engineer's Eye watermark */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 font-mono-tech tracking-widest">
          Engineer&apos;s Eye
        </div>
      </main>
    </div>
  );
};

export default Index;
