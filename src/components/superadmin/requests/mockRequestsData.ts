
interface PendingRequest {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requestDate: string;
  licenseType: string;
  estimatedUsers: number;
  status: 'pending_review' | 'documentation_required' | 'ready_for_setup';
  businessType?: string;
  fleetSize?: number;
  city?: string;
  country?: string;
  notes?: string;
}

export const mockRequests: PendingRequest[] = [
  {
    id: '1',
    organizationName: 'Mediterranean Airlines',
    contactPerson: 'Marco Rossi',
    email: 'marco.rossi@medair.com',
    phone: '+39 06 1234567',
    requestDate: '2024-06-28',
    licenseType: 'Premium',
    estimatedUsers: 35,
    status: 'pending_review',
    businessType: 'airline',
    fleetSize: 8,
    city: 'Roma',
    country: 'Italia'
  },
  {
    id: '2',
    organizationName: 'Alpine Helicopters',
    contactPerson: 'Anna Bianchi',
    email: 'a.bianchi@alpinehelis.com',
    phone: '+39 011 987654',
    requestDate: '2024-06-27',
    licenseType: 'Standard',
    estimatedUsers: 15,
    status: 'documentation_required',
    businessType: 'helicopter',
    fleetSize: 3,
    city: 'Milano',
    country: 'Italia'
  }
];
