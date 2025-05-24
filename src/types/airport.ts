
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
