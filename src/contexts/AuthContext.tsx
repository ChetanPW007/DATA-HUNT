import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Team {
  id: string;
  team_name: string;
  username: string;
  current_stage: number;
  completed: boolean;
}

interface Admin {
  id: string;
  admin_name: string;
  username: string;
}

interface AuthContextType {
  team: Team | null;
  admin: Admin | null;
  isTeamLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  loginTeam: (team: Team) => void;
  loginAdmin: (admin: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const storedTeam = sessionStorage.getItem('datahunt_team');
    const storedAdmin = sessionStorage.getItem('datahunt_admin');
    
    if (storedTeam) {
      setTeam(JSON.parse(storedTeam));
    }
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const loginTeam = (teamData: Team) => {
    setTeam(teamData);
    setAdmin(null);
    sessionStorage.setItem('datahunt_team', JSON.stringify(teamData));
    sessionStorage.removeItem('datahunt_admin');
  };

  const loginAdmin = (adminData: Admin) => {
    setAdmin(adminData);
    setTeam(null);
    sessionStorage.setItem('datahunt_admin', JSON.stringify(adminData));
    sessionStorage.removeItem('datahunt_team');
  };

  const logout = () => {
    setTeam(null);
    setAdmin(null);
    sessionStorage.removeItem('datahunt_team');
    sessionStorage.removeItem('datahunt_admin');
  };

  return (
    <AuthContext.Provider value={{
      team,
      admin,
      isTeamLoggedIn: !!team,
      isAdminLoggedIn: !!admin,
      loginTeam,
      loginAdmin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
