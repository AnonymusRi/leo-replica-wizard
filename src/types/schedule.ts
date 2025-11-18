
import type { Client } from './client';
import type { Flight } from './flight';

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
