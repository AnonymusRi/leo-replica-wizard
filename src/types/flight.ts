
import type { Aircraft } from './aircraft';
import type { Client } from './client';
import type { CrewMember } from './crew';

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
