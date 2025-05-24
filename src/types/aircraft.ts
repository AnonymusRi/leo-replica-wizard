
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
