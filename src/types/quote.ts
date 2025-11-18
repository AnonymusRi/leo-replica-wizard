
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
  // New pricing fields
  pricing_method?: string;
  base_cost?: number;
  margin_percentage?: number;
  fuel_cost?: number;
  crew_cost?: number;
  handling_cost?: number;
  other_costs?: number;
  vat_rate?: number;
  vat_amount?: number;
  marketplace_source?: string;
  client?: {
    company_name: string;
    contact_person?: string;
  };
}
