
-- Tabella per i profili crew estesi
CREATE TABLE crew_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url TEXT,
  personal_notes TEXT,
  preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(crew_member_id)
);

-- Tabella per i messaggi personali ai crew
CREATE TABLE crew_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'personal' CHECK (message_type IN ('personal', 'official', 'training', 'schedule')),
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Tabella per le statistiche crew
CREATE TABLE crew_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
  month_year DATE NOT NULL, -- primo giorno del mese per raggruppare
  total_flight_hours DECIMAL(5,2) DEFAULT 0,
  total_duty_hours DECIMAL(5,2) DEFAULT 0,
  total_flights INTEGER DEFAULT 0,
  total_sectors INTEGER DEFAULT 0,
  night_hours DECIMAL(5,2) DEFAULT 0,
  simulator_hours DECIMAL(5,2) DEFAULT 0,
  training_hours DECIMAL(5,2) DEFAULT 0,
  days_off INTEGER DEFAULT 0,
  ftl_violations INTEGER DEFAULT 0,
  performance_rating DECIMAL(3,2), -- da 0 a 10
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(crew_member_id, month_year)
);

-- Tabella per i livelli di fatica (fatigue)
CREATE TABLE crew_fatigue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL,
  fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10), -- 1 = molto riposato, 10 = molto stanco
  sleep_hours DECIMAL(3,1),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  workload_rating INTEGER CHECK (workload_rating BETWEEN 1 AND 10),
  notes TEXT,
  auto_calculated BOOLEAN DEFAULT false, -- se calcolato automaticamente dal sistema
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabella per le sessioni di accesso crew
CREATE TABLE crew_auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  is_mobile BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indici per performance
CREATE INDEX idx_crew_messages_crew_member ON crew_messages(crew_member_id);
CREATE INDEX idx_crew_messages_unread ON crew_messages(crew_member_id, is_read) WHERE is_read = false;
CREATE INDEX idx_crew_statistics_crew_month ON crew_statistics(crew_member_id, month_year);
CREATE INDEX idx_crew_fatigue_crew_date ON crew_fatigue_records(crew_member_id, assessment_date);
CREATE INDEX idx_crew_auth_sessions_token ON crew_auth_sessions(session_token);
CREATE INDEX idx_crew_auth_sessions_crew ON crew_auth_sessions(crew_member_id);

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_crew_profiles_updated_at
  BEFORE UPDATE ON crew_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_statistics_updated_at
  BEFORE UPDATE ON crew_statistics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE crew_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_fatigue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_auth_sessions ENABLE ROW LEVEL SECURITY;

-- Policy per crew_profiles: i crew possono vedere solo il proprio profilo
CREATE POLICY "Crew can view own profile" ON crew_profiles
  FOR SELECT USING (
    crew_member_id IN (
      SELECT id FROM crew_members WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Crew can update own profile" ON crew_profiles
  FOR UPDATE USING (
    crew_member_id IN (
      SELECT id FROM crew_members WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy per crew_messages
CREATE POLICY "Crew can view own messages" ON crew_messages
  FOR SELECT USING (
    crew_member_id IN (
      SELECT id FROM crew_members WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy per crew_statistics
CREATE POLICY "Crew can view own statistics" ON crew_statistics
  FOR SELECT USING (
    crew_member_id IN (
      SELECT id FROM crew_members WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Policy per crew_fatigue_records
CREATE POLICY "Crew can manage own fatigue records" ON crew_fatigue_records
  FOR ALL USING (
    crew_member_id IN (
      SELECT id FROM crew_members WHERE email = auth.jwt() ->> 'email'
    )
  );
