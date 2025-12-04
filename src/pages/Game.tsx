import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LevelTitle from '@/components/LevelTitle';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import CyberInput from '@/components/CyberInput';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MapPin, Lock, CheckCircle } from 'lucide-react';

interface Stage {
  id: string;
  stage_number: number;
  location_name: string;
  solution: string;
  is_completed: boolean;
}

const Game = () => {
  const navigate = useNavigate();
  const { team, loginTeam, isTeamLoggedIn } = useAuth();
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isTeamLoggedIn) {
      navigate('/login');
      return;
    }

    if (team?.completed) {
      navigate('/completion');
      return;
    }

    fetchCurrentStage();
  }, [isTeamLoggedIn, team]);

  const fetchCurrentStage = async () => {
    if (!team) return;

    const { data, error: dbError } = await supabase
      .from('team_stages')
      .select('*')
      .eq('team_id', team.id)
      .eq('stage_number', team.current_stage)
      .single();

    if (dbError) {
      toast.error('Failed to load stage');
      return;
    }

    setCurrentStage(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!answer.trim()) {
      setError('Please enter a solution');
      setSubmitting(false);
      return;
    }

    if (!currentStage || !team) {
      setSubmitting(false);
      return;
    }

    // Check if answer is correct (case-insensitive)
    if (answer.trim().toLowerCase() !== currentStage.solution.toLowerCase()) {
      setError('Incorrect solution. Try again!');
      setSubmitting(false);
      return;
    }

    // Mark current stage as completed
    await supabase
      .from('team_stages')
      .update({ is_completed: true, completed_at: new Date().toISOString() })
      .eq('id', currentStage.id);

    // Check if this was the last stage
    if (currentStage.stage_number === 8) {
      // Mark team as completed
      await supabase
        .from('teams')
        .update({ completed: true, current_stage: 8 })
        .eq('id', team.id);

      loginTeam({ ...team, completed: true, current_stage: 8 });
      toast.success('Congratulations! You completed all stages!');
      navigate('/completion');
    } else {
      // Move to next stage
      const nextStage = currentStage.stage_number + 1;
      await supabase
        .from('teams')
        .update({ current_stage: nextStage })
        .eq('id', team.id);

      loginTeam({ ...team, current_stage: nextStage });
      toast.success(`Stage ${currentStage.stage_number} completed! Moving to Stage ${nextStage}`);
      setAnswer('');
      setLoading(true);
      
      // Fetch next stage
      const { data: nextStageData } = await supabase
        .from('team_stages')
        .select('*')
        .eq('team_id', team.id)
        .eq('stage_number', nextStage)
        .single();

      setCurrentStage(nextStageData);
      setLoading(false);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col cyber-grid">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <LevelTitle />
        
        {/* Stage Progress */}
        <div className="flex items-center gap-1 md:gap-2 mb-6 flex-wrap justify-center">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <div
              key={num}
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-orbitron font-bold transition-all ${
                num < (team?.current_stage || 1)
                  ? 'bg-primary text-primary-foreground'
                  : num === team?.current_stage
                  ? 'bg-primary/20 border-2 border-primary text-primary animate-pulse'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {num < (team?.current_stage || 1) ? (
                <CheckCircle className="w-4 h-4" />
              ) : num === team?.current_stage ? (
                num
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </div>
          ))}
        </div>

        <CyberCard className="max-w-lg w-full animate-scale-in" glowColor="primary">
          {/* Stage Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-primary text-glow">
              Stage {currentStage?.stage_number}
            </h2>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-3 mb-8 p-3 md:p-4 bg-muted/50 rounded-lg border border-border">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-accent flex-shrink-0" />
            <span className="text-lg md:text-xl font-rajdhani font-semibold text-foreground text-center">
              {currentStage?.location_name}
            </span>
          </div>

          {/* Solution Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <CyberInput
              label="Enter Solution"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              error={error}
            />

            <CyberButton
              type="submit"
              variant={currentStage?.stage_number === 8 ? 'accent' : 'primary'}
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : currentStage?.stage_number === 8 ? (
                'SUBMIT'
              ) : (
                'NEXT STAGE'
              )}
            </CyberButton>
          </form>
        </CyberCard>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 font-mono-tech tracking-widest">
          Engineer&apos;s Eye
        </div>
      </main>
    </div>
  );
};

export default Game;
