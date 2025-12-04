import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LevelTitle from '@/components/LevelTitle';
import CyberCard from '@/components/CyberCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Sparkles } from 'lucide-react';

const Completion = () => {
  const navigate = useNavigate();
  const { isTeamLoggedIn, team } = useAuth();
  const [content, setContent] = useState({
    title: 'Congratulations',
    line1: 'You Have Successfully Completed ALL Stages.',
    line2: 'Go And meet the Event Coordinator',
    line3: 'raeN dnuorg roolf kcolb TEF moorssalC r',
    line4: 'To Win The Competition',
  });

  useEffect(() => {
    if (!isTeamLoggedIn || !team?.completed) {
      navigate('/');
      return;
    }

    const fetchContent = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'completion_title',
          'completion_line_1',
          'completion_line_2',
          'completion_line_3',
          'completion_line_4',
        ]);

      if (data) {
        const settings: Record<string, string> = {};
        data.forEach(item => {
          settings[item.setting_key] = item.setting_value;
        });
        setContent({
          title: settings.completion_title || content.title,
          line1: settings.completion_line_1 || content.line1,
          line2: settings.completion_line_2 || content.line2,
          line3: settings.completion_line_3 || content.line3,
          line4: settings.completion_line_4 || content.line4,
        });
      }
    };

    fetchContent();
  }, [isTeamLoggedIn, team]);

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <LevelTitle />
        
        {/* Celebration Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-accent animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5 + 0.2,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>

        <CyberCard 
          className="max-w-2xl w-full animate-scale-in relative z-10" 
          glowColor="accent"
          animate
        >
          {/* Trophy Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 text-accent animate-pulse-glow" />
              <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-orbitron font-black text-accent text-glow-lg">
              {content.title}
            </h1>
            
            <div className="space-y-3 pt-4">
              <p className="text-lg md:text-xl font-rajdhani text-foreground font-semibold">
                {content.line1}
              </p>
              <p className="text-base md:text-lg font-rajdhani text-muted-foreground">
                {content.line2}
              </p>
              <p className="text-sm md:text-lg font-mono-tech text-primary py-3 md:py-4 px-4 md:px-6 bg-muted/50 rounded-lg border border-primary/30 inline-block break-all">
                {content.line3}
              </p>
              <p className="text-base md:text-lg font-rajdhani text-accent font-semibold">
                {content.line4}
              </p>
            </div>
          </div>

        </CyberCard>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 font-mono-tech tracking-widest">
          Engineer&apos;s Eye
        </div>
      </main>
    </div>
  );
};

export default Completion;
