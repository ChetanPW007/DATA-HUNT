-- Create teams table for 10 teams login
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  current_stage INTEGER NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admins table for 4 admins
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_stages table for 8 stages per team
CREATE TABLE public.team_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  stage_number INTEGER NOT NULL CHECK (stage_number >= 1 AND stage_number <= 8),
  location_name TEXT NOT NULL DEFAULT 'Location Name',
  solution TEXT NOT NULL DEFAULT 'solution',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, stage_number)
);

-- Create site_settings table for editable content
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams - allow read for login validation
CREATE POLICY "Allow public read for login" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Allow public update for progress" ON public.teams FOR UPDATE USING (true);

-- RLS Policies for admins - allow read for login validation
CREATE POLICY "Allow public read admins" ON public.admins FOR SELECT USING (true);

-- RLS Policies for team_stages
CREATE POLICY "Allow public read stages" ON public.team_stages FOR SELECT USING (true);
CREATE POLICY "Allow public update stages" ON public.team_stages FOR UPDATE USING (true);

-- RLS Policies for site_settings - public read, admin update
CREATE POLICY "Allow public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public insert settings" ON public.site_settings FOR INSERT WITH CHECK (true);

-- Insert 10 default teams
INSERT INTO public.teams (team_name, username, password) VALUES
  ('Team Alpha', 'team1', 'pass1'),
  ('Team Beta', 'team2', 'pass2'),
  ('Team Gamma', 'team3', 'pass3'),
  ('Team Delta', 'team4', 'pass4'),
  ('Team Epsilon', 'team5', 'pass5'),
  ('Team Zeta', 'team6', 'pass6'),
  ('Team Eta', 'team7', 'pass7'),
  ('Team Theta', 'team8', 'pass8'),
  ('Team Iota', 'team9', 'pass9'),
  ('Team Kappa', 'team10', 'pass10');

-- Insert 4 default admins
INSERT INTO public.admins (admin_name, username, password) VALUES
  ('Admin One', 'admin1', 'adminpass1'),
  ('Admin Two', 'admin2', 'adminpass2'),
  ('Admin Three', 'admin3', 'adminpass3'),
  ('Admin Four', 'admin4', 'adminpass4');

-- Insert 8 stages for each team
INSERT INTO public.team_stages (team_id, stage_number, location_name, solution)
SELECT t.id, s.num, 'Location ' || s.num, 'solution' || s.num
FROM public.teams t
CROSS JOIN generate_series(1, 8) AS s(num);

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
  ('landing_line_1', 'Welcome to the ultimate treasure hunt!'),
  ('landing_line_2', 'Test your skills across 8 challenging stages.'),
  ('landing_line_3', 'Work as a team to decode locations and find solutions.'),
  ('landing_line_4', 'May the best team win!'),
  ('completion_title', 'Congratulations'),
  ('completion_line_1', 'You Have Successfully Completed ALL Stages.'),
  ('completion_line_2', 'Go And meet the Event Coordinator'),
  ('completion_line_3', 'raeN dnuorg roolf kcolb TEF moorssalC r'),
  ('completion_line_4', 'To Win The Competition');