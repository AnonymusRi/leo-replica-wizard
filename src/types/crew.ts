
export interface CrewMember {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position: 'captain' | 'first_officer' | 'cabin_crew' | 'mechanic';
  license_number?: string;
  license_expiry?: string;
  medical_expiry?: string;
  base_location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CrewQualification {
  id: string;
  crew_member_id?: string;
  aircraft_type: string;
  qualification_type: string;
  issue_date: string;
  expiry_date?: string;
  authority?: string;
  certificate_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  crew_member?: CrewMember;
}

export interface PilotFlightHour {
  id: string;
  pilot_id: string;
  flight_id?: string;
  flight_date: string;
  flight_hours: number;
  flight_type: string;
  created_at: string;
  updated_at: string;
}

export interface PilotSchedule {
  id: string;
  pilot_id: string;
  start_date: string;
  end_date: string;
  schedule_type: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FlightTimeLimit {
  id: string;
  regulation_name: string;
  daily_limit: number;
  weekly_limit: number;
  monthly_limit: number;
  yearly_limit: number;
  min_rest_between_duties: number;
  min_weekly_rest: number;
  created_at: string;
  updated_at: string;
}
