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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings, MapPin, RefreshCw, RotateCcw, CheckCircle, Clock } from 'lucide-react';

interface Team {
  id: string;
  team_name: string;
  username: string;
  password: string;
  current_stage: number;
  completed: boolean;
}

interface AdminData {
  id: string;
  admin_name: string;
  username: string;
  password: string;
}

interface Stage {
  id: string;
  team_id: string;
  stage_number: number;
  location_name: string;
  solution: string;
  is_completed: boolean;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resettingAll, setResettingAll] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin-login');
      return;
    }

    fetchAllData();
  }, [isAdminLoggedIn]);

  const fetchAllData = async () => {
    setLoading(true);
    
    const [teamsRes, adminsRes, stagesRes, settingsRes] = await Promise.all([
      supabase.from('teams').select('*').order('team_name'),
      supabase.from('admins').select('*').order('admin_name'),
      supabase.from('team_stages').select('*').order('stage_number'),
      supabase.from('site_settings').select('*'),
    ]);

    if (teamsRes.data) setTeams(teamsRes.data);
    if (adminsRes.data) setAdmins(adminsRes.data);
    if (stagesRes.data) setStages(stagesRes.data);
    if (settingsRes.data) setSettings(settingsRes.data);
    
    if (teamsRes.data && teamsRes.data.length > 0) {
      setSelectedTeam(teamsRes.data[0].id);
    }

    setLoading(false);
  };

  const updateTeam = async (teamId: string, field: keyof Team, value: string | number | boolean) => {
    const { error } = await supabase
      .from('teams')
      .update({ [field]: value })
      .eq('id', teamId);

    if (error) {
      toast.error('Failed to update team');
      return;
    }

    setTeams(teams.map(t => t.id === teamId ? { ...t, [field]: value } : t));
    toast.success('Team updated');
  };

  const updateAdmin = async (adminId: string, field: keyof AdminData, value: string) => {
    const { error } = await supabase
      .from('admins')
      .update({ [field]: value })
      .eq('id', adminId);

    if (error) {
      toast.error('Failed to update admin');
      return;
    }

    setAdmins(admins.map(a => a.id === adminId ? { ...a, [field]: value } : a));
    toast.success('Admin updated');
  };

  const updateStage = async (stageId: string, field: keyof Stage, value: string | boolean) => {
    const { error } = await supabase
      .from('team_stages')
      .update({ [field]: value })
      .eq('id', stageId);

    if (error) {
      toast.error('Failed to update stage');
      return;
    }

    setStages(stages.map(s => s.id === stageId ? { ...s, [field]: value } : s));
    toast.success('Stage updated');
  };

  const updateSetting = async (settingId: string, value: string) => {
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: value, updated_at: new Date().toISOString() })
      .eq('id', settingId);

    if (error) {
      toast.error('Failed to update setting');
      return;
    }

    setSettings(settings.map(s => s.id === settingId ? { ...s, setting_value: value } : s));
    toast.success('Setting updated');
  };

  const resetTeamProgress = async (teamId: string) => {
    setSaving(true);
    
    // Reset team progress
    await supabase
      .from('teams')
      .update({ current_stage: 1, completed: false })
      .eq('id', teamId);

    // Reset all stages for team
    await supabase
      .from('team_stages')
      .update({ is_completed: false, completed_at: null })
      .eq('team_id', teamId);

    await fetchAllData();
    toast.success('Team progress reset');
    setSaving(false);
  };

  const resetAllTeamsProgress = async () => {
    if (!confirm('Are you sure you want to reset ALL teams progress? This cannot be undone.')) {
      return;
    }
    
    setResettingAll(true);
    
    // Reset all teams progress
    await supabase
      .from('teams')
      .update({ current_stage: 1, completed: false });

    // Reset all stages
    await supabase
      .from('team_stages')
      .update({ is_completed: false, completed_at: null });

    await fetchAllData();
    toast.success('All teams progress reset');
    setResettingAll(false);
  };

  const teamStages = stages.filter(s => s.team_id === selectedTeam);
  const selectedTeamData = teams.find(t => t.id === selectedTeam);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col cyber-grid">
        <Header showLogout />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      <Header showLogout />
      
      <main className="flex-1 px-3 md:px-4 py-6 md:py-8 max-w-6xl mx-auto w-full">
        <LevelTitle />
        
        <h1 className="text-xl md:text-3xl font-orbitron font-bold text-secondary text-glow-md text-center mb-6 md:mb-8">
          Admin Control Panel
        </h1>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border mb-4 md:mb-6">
            <TabsTrigger value="progress" className="font-orbitron text-[10px] md:text-xs px-1 md:px-3">
              <Clock className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Progress</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="font-orbitron text-[10px] md:text-xs px-1 md:px-3">
              <Users className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Teams</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="font-orbitron text-[10px] md:text-xs px-1 md:px-3">
              <Users className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Admins</span>
            </TabsTrigger>
            <TabsTrigger value="stages" className="font-orbitron text-[10px] md:text-xs px-1 md:px-3">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Stages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="font-orbitron text-[10px] md:text-xs px-1 md:px-3">
              <Settings className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <CyberCard glowColor="primary">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg md:text-xl font-orbitron font-bold text-primary">Team Progress</h2>
                <CyberButton
                  variant="destructive"
                  size="sm"
                  onClick={resetAllTeamsProgress}
                  disabled={resettingAll}
                  className="w-full sm:w-auto"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {resettingAll ? 'Resetting...' : 'Reset All Teams'}
                </CyberButton>
              </div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {teams.map((team) => (
                  <div 
                    key={team.id} 
                    className={`p-3 md:p-4 rounded-lg border ${
                      team.completed 
                        ? 'bg-primary/10 border-primary/50' 
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base md:text-lg font-orbitron font-bold text-foreground">
                            {team.team_name}
                          </span>
                          {team.completed && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <div
                              key={num}
                              className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                                num < team.current_stage || (team.completed && num === 8)
                                  ? 'bg-primary text-primary-foreground'
                                  : num === team.current_stage && !team.completed
                                  ? 'bg-primary/30 border border-primary text-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-mono-tech">
                          {team.completed 
                            ? 'Completed All Stages!' 
                            : `Currently at Stage ${team.current_stage}`}
                        </p>
                      </div>
                      <CyberButton
                        variant="ghost"
                        size="sm"
                        onClick={() => resetTeamProgress(team.id)}
                        disabled={saving}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Reset
                      </CyberButton>
                    </div>
                  </div>
                ))}
              </div>
            </CyberCard>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams">
            <CyberCard glowColor="secondary">
              <h2 className="text-lg md:text-xl font-orbitron font-bold text-secondary mb-4">Team Credentials</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {teams.map((team) => (
                  <div key={team.id} className="p-3 md:p-4 bg-muted/30 rounded-lg border border-border space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <CyberInput
                        label="Team Name"
                        value={team.team_name}
                        onChange={(e) => updateTeam(team.id, 'team_name', e.target.value)}
                      />
                      <CyberInput
                        label="Username"
                        value={team.username}
                        onChange={(e) => updateTeam(team.id, 'username', e.target.value)}
                      />
                      <CyberInput
                        label="Password"
                        value={team.password}
                        onChange={(e) => updateTeam(team.id, 'password', e.target.value)}
                      />
                      <div className="flex items-end gap-2">
                        <div className="text-xs text-muted-foreground">
                          <p>Stage: {team.current_stage}/8</p>
                          <p>Status: {team.completed ? 'Completed' : 'In Progress'}</p>
                        </div>
                        <CyberButton
                          variant="ghost"
                          size="sm"
                          onClick={() => resetTeamProgress(team.id)}
                          disabled={saving}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </CyberButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CyberCard>
          </TabsContent>

          {/* Admins Tab */}
          <TabsContent value="admins">
            <CyberCard glowColor="secondary">
              <h2 className="text-lg md:text-xl font-orbitron font-bold text-secondary mb-4">Admin Credentials</h2>
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="p-3 md:p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <CyberInput
                        label="Admin Name"
                        value={admin.admin_name}
                        onChange={(e) => updateAdmin(admin.id, 'admin_name', e.target.value)}
                      />
                      <CyberInput
                        label="Username"
                        value={admin.username}
                        onChange={(e) => updateAdmin(admin.id, 'username', e.target.value)}
                      />
                      <CyberInput
                        label="Password"
                        value={admin.password}
                        onChange={(e) => updateAdmin(admin.id, 'password', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CyberCard>
          </TabsContent>

          {/* Stages Tab */}
          <TabsContent value="stages">
            <CyberCard glowColor="primary">
              <h2 className="text-lg md:text-xl font-orbitron font-bold text-primary mb-4">Stage Configuration</h2>
              
              {/* Team Selector */}
              <div className="mb-6">
                <label className="block text-sm font-rajdhani font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Select Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-4 py-3 bg-input border-2 border-border rounded-lg font-mono-tech text-foreground focus:outline-none focus:border-primary"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTeamData && (
                <p className="text-sm text-muted-foreground mb-4 font-mono-tech">
                  Current Progress: Stage {selectedTeamData.current_stage} | 
                  Status: {selectedTeamData.completed ? '✅ Completed' : '🔄 In Progress'}
                </p>
              )}

              <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                {teamStages.map((stage) => (
                  <div 
                    key={stage.id} 
                    className={`p-3 md:p-4 rounded-lg border ${
                      stage.is_completed 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base md:text-lg font-orbitron font-bold text-primary">
                        Stage {stage.stage_number}
                      </span>
                      {stage.is_completed && (
                        <span className="text-xs text-primary font-mono-tech">✓ Completed</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <CyberInput
                        label="Location Name"
                        value={stage.location_name}
                        onChange={(e) => updateStage(stage.id, 'location_name', e.target.value)}
                      />
                      <CyberInput
                        label="Solution"
                        value={stage.solution}
                        onChange={(e) => updateStage(stage.id, 'solution', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CyberCard>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <CyberCard glowColor="accent">
              <h2 className="text-lg md:text-xl font-orbitron font-bold text-accent mb-4">Site Settings</h2>
              <div className="space-y-4">
                <div className="border-b border-border pb-4 mb-4">
                  <h3 className="text-sm font-orbitron text-muted-foreground mb-3">Landing Page Lines</h3>
                  {settings.filter(s => s.setting_key.startsWith('landing_')).map((setting) => (
                    <div key={setting.id} className="mb-3">
                      <CyberInput
                        label={setting.setting_key.replace('landing_', '').replace('_', ' ')}
                        value={setting.setting_value}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-sm font-orbitron text-muted-foreground mb-3">Completion Screen</h3>
                  {settings.filter(s => s.setting_key.startsWith('completion_')).map((setting) => (
                    <div key={setting.id} className="mb-3">
                      <CyberInput
                        label={setting.setting_key.replace('completion_', '').replace('_', ' ')}
                        value={setting.setting_value}
                        onChange={(e) => updateSetting(setting.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CyberCard>
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/40 font-mono-tech tracking-widest">
          Engineer&apos;s Eye
        </div>
      </main>
    </div>
  );
};

export default Admin;
