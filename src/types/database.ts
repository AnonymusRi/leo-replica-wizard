
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

// Nuove interfacce per le tabelle aggiunte
export interface Airport {
  id: string;
  icao_code: string;
  iata_code?: string;
  name: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  elevation?: number;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduleVersion {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  version_number: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface PublishedSchedule {
  id: string;
  schedule_version_id?: string;
  flight_id?: string;
  published_at: string;
  published_by?: string;
  trip_type?: string;
  is_option?: boolean;
  is_commercial?: boolean;
  created_at: string;
  schedule_version?: ScheduleVersion;
  flight?: Flight;
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

export interface FlightAssignment {
  id: string;
  flight_id?: string;
  crew_member_id?: string;
  position: string;
  assigned_at: string;
  assigned_by?: string;
  notes?: string;
  created_at: string;
  flight?: Flight;
  crew_member?: CrewMember;
}

export interface ScheduleChange {
  id: string;
  flight_id?: string;
  change_type: string;
  old_value?: any;
  new_value?: any;
  reason?: string;
  changed_by?: string;
  changed_at: string;
  approved_by?: string;
  approved_at?: string;
  flight?: Flight;
}

export interface MaintenanceType {
  id: string;
  name: string;
  description?: string;
  category?: string;
  required_hours?: number;
  required_cycles?: number;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface FlightLeg {
  id: string;
  flight_id?: string;
  leg_number: number;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  distance?: number;
  fuel_required?: number;
  created_at: string;
  updated_at: string;
  flight?: Flight;
}
