
export interface DetailedFlight {
  id: string;
  fw_jl: string;
  flight_no: string;
  icao_type: string;
  day: string;
  date: string;
  std: string;
  adep: string;
  ades: string;
  status: string;
  captain: string;
  cpt2: string;
  fo: string;
  fa1: string;
  trip_no: string;
  pax_cargo: string;
  properties: string;
  tags: string[];
  cautions?: string;
  rescue_category?: string;
  phone?: string;
  pax_capacity?: number;
  mtow?: number;
  wifi?: boolean;
}

export interface OpsDetailedTableViewProps {
  flights: any[];
  onFlightSelect: (flight: any) => void;
}
