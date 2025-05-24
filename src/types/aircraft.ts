
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

export interface AircraftTechnicalData {
  id: string;
  aircraft_id: string;
  airframe_tah_hours: number;
  airframe_tah_minutes: number;
  airframe_tac: number;
  engine_1_serial_number?: string;
  engine_1_tah_hours: number;
  engine_1_tah_minutes: number;
  engine_1_tac: number;
  engine_1_start_date?: string;
  engine_2_serial_number?: string;
  engine_2_tah_hours: number;
  engine_2_tah_minutes: number;
  engine_2_tac: number;
  engine_2_start_date?: string;
  apu_serial_number?: string;
  apu_tah_hours: number;
  apu_tah_minutes: number;
  apu_tac: number;
  apu_start_date?: string;
  last_updated: string;
  updated_by?: string;
  created_at: string;
  aircraft?: Aircraft;
}

export interface AircraftMaintenanceLimits {
  id: string;
  aircraft_id: string;
  flight_hours_limit?: number;
  flight_cycles_limit?: number;
  calendar_limit_date?: string;
  next_inspection_hours?: number;
  next_inspection_cycles?: number;
  next_inspection_date?: string;
  inspection_type: string;
  warning_threshold_days: number;
  created_at: string;
  updated_at: string;
  aircraft?: Aircraft;
}

export interface AircraftDocument {
  id: string;
  aircraft_id: string;
  document_name: string;
  document_type: string;
  document_number?: string;
  issue_date?: string;
  expiry_date?: string;
  issuing_authority?: string;
  file_path?: string;
  is_required_for_dispatch: boolean;
  status: 'valid' | 'expired' | 'expiring_soon';
  created_at: string;
  updated_at: string;
  aircraft?: Aircraft;
}

export interface AircraftHoldItem {
  id: string;
  aircraft_id: string;
  item_reference: string;
  item_description: string;
  limitation_description?: string;
  date_applied: string;
  applied_by?: string;
  status: 'active' | 'resolved' | 'deferred';
  resolution_date?: string;
  resolution_description?: string;
  ata_chapter?: string;
  mel_reference?: string;
  created_at: string;
  updated_at: string;
  aircraft?: Aircraft;
}

export interface OilConsumptionRecord {
  id: string;
  aircraft_id: string;
  engine_position: 'Engine 1' | 'Engine 2' | 'APU';
  flight_date: string;
  flight_hours?: number;
  oil_added_liters?: number;
  oil_level_before?: number;
  oil_level_after?: number;
  consumption_rate?: number;
  notes?: string;
  recorded_by?: string;
  created_at: string;
  aircraft?: Aircraft;
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

// Import CrewMember type for the technician reference
import type { CrewMember } from './crew';
