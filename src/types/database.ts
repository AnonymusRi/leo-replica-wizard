
export interface Aircraft {
  id: string;
  tail_number: string;
  aircraft_type: string;
  manufacturer: string;
  model: string;
  year_manufactured?: number;
  max_passengers?: number;
  status: 'available' | 'maintenance' | 'aog' | 'retired';
  home_base?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

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

export interface Flight {
  id: string;
  flight_number: string;
  aircraft_id?: string;
  client_id?: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  passenger_count: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled' | 'delayed';
  notes?: string;
  created_at: string;
  updated_at: string;
  aircraft?: Aircraft;
  client?: Client;
}

export interface Quote {
  id: string;
  quote_number: string;
  client_id?: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  return_date?: string;
  passenger_count: number;
  aircraft_type?: string;
  total_amount?: number;
  status: string;
  valid_until?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface MaintenanceRecord {
  id: string;
  aircraft_id?: string;
  maintenance_type: string;
  description: string;
  scheduled_date: string;
  completed_date?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  technician_id?: string;
  cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  aircraft?: Aircraft;
  technician?: CrewMember;
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
