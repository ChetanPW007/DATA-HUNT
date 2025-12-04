import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import LevelTitle from '@/components/LevelTitle';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import CyberInput from '@/components/CyberInput';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, ArrowLeft } from 'lucide-react';

const TeamLogin = () => {
  const navigate = useNavigate();
  const { loginTeam, isTeamLoggedIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 AUTO-REDIRECT IF ALREADY LOGGED-IN (prevents going to login page)
  useEffect(() => {
    if (isTeamLoggedIn) {
      navigate('/game', { replace: true });
    }
  }, [isTeamLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase
      .from('teams')
      .select('*')
      .eq('username', username.trim())
      .eq('password', password.trim())
      .single();

    if (dbError || !data) {
      setError('Invalid credentials. No new registrations allowed.');
      setLoading(false);
      return;
    }

    loginTeam({
      id: data.id,
      team_name: data.team_name,
      username: data.username,
      current_stage: data.current_stage,
      completed: data.completed,
    });

    toast.success(`Welcome, ${data.team_name}!`);
    
    if (data.completed) navigate('/completion');
    else navigate('/game');
  };

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="absolute top-24 left-4 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono-tech text-sm">Back</span>
        </button>

        <LevelTitle />

        <CyberCard className="max-w-md w-full animate-scale-in" glowColor="primary">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-primary animate-pulse-glow" />
          </div>

          <h2 className="text-2xl font-orbitron font-bold text-center text-primary text-glow mb-2">
            Team Login
          </h2>

          <p className="text-center text-muted-foreground text-sm mb-6 font-mono-tech">
            Secure Access Only — No Sign Up
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <CyberInput
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter team username"
              autoComplete="username"
            />
            
            <CyberInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-destructive font-mono-tech">{error}</p>
              </div>
            )}

            <CyberButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Secure Login'
              )}
            </CyberButton>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4 font-mono-tech">
            Only Selected Teams Can Access
          </p>
        </CyberCard>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 font-mono-tech tracking-widest">
          Engineer&apos;s Eye
        </div>
      </main>
    </div>
  );
};

export default TeamLogin;
