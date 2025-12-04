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
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 AUTO REDIRECT IF ADMIN ALREADY LOGGED IN
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

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
      .from('admins')
      .select('*')
      .eq('username', username.trim())
      .eq('password', password.trim())
      .single();

    if (dbError || !data) {
      setError('Invalid admin credentials');
      setLoading(false);
      return;
    }

    loginAdmin({
      id: data.id,
      admin_name: data.admin_name,
      username: data.username,
    });

    toast.success(`Welcome, ${data.admin_name}!`);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="absolute top-24 left-4 flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono-tech text-sm">Back</span>
        </button>

        <LevelTitle />

        <CyberCard className="max-w-md w-full animate-scale-in" glowColor="secondary">
          <div className="flex items-center justify-center mb-6">
            <ShieldCheck className="w-12 h-12 text-secondary animate-pulse-glow" />
          </div>

          <h2 className="text-2xl font-orbitron font-bold text-center text-secondary text-glow mb-2">
            Admin Panel
          </h2>

          <p className="text-center text-muted-foreground text-sm mb-6 font-mono-tech">
            Authorized Personnel Only
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <CyberInput
              label="Admin Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
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
              variant="secondary"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Access Admin Panel'
              )}
            </CyberButton>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4 font-mono-tech">
            No registration available
          </p>
        </CyberCard>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 font-mono-tech tracking-widest">
          Engineer&apos;s Eye
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
