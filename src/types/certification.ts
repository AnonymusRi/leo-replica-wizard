
export interface CrewCertification {
  id: string;
  crew_member_id: string;
  certification_type: string;
  aircraft_type?: string;
  certificate_number?: string;
  issue_date: string;
  expiry_date?: string;
  issuing_authority: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AircraftCertificationRequirement {
  id: string;
  aircraft_id: string;
  required_certification_type: string;
  is_mandatory: boolean;
  created_at: string;
}

export interface EnacNotification {
  id: string;
  crew_member_id: string;
  flight_id: string;
  expired_certification_type: string;
  justification: string;
  notification_date: string;
  sent_by?: string;
  status: 'pending' | 'sent' | 'acknowledged';
  enac_response?: string;
  created_at: string;
}

export interface CrewValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  expiredCertifications: CrewCertification[];
  canForce: boolean;
}
