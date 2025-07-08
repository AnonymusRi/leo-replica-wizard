
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { OrganizationRequestModal } from "./OrganizationRequestModal";
import { OrganizationRequestsTable } from "./requests/OrganizationRequestsTable";
import { mockRequests } from "./requests/mockRequestsData";
import { useCreateOrganization } from "@/hooks/useCreateOrganization";
import { toast } from "sonner";

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

export const PendingOrganizationRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [processedRequests, setProcessedRequests] = useState<Set<string>>(new Set());
  const createOrganization = useCreateOrganization();

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getActiveModules = (licenseType: string) => {
    switch (licenseType.toLowerCase()) {
      case 'trial':
        return ['SCHED', 'SALES'];
      case 'standard':
        return ['SCHED', 'SALES', 'OPS', 'CREW'];
      case 'premium':
        return ['SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 'MX'];
      case 'enterprise':
        return ['SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'];
      default:
        return ['SCHED', 'SALES'];
    }
  };

  const handleApprove = async (request: PendingRequest) => {
    console.log('🎯 Approvazione richiesta organizzazione:', request);
    
    try {
      toast.info(`Creazione organizzazione ${request.organizationName} in corso...`);
      
      await createOrganization.mutateAsync({
        name: request.organizationName,
        slug: generateSlug(request.organizationName),
        email: request.email,
        phone: request.phone,
        city: request.city,
        country: request.country,
        subscription_status: 'active',
        active_modules: getActiveModules(request.licenseType),
        settings: {
          default_timezone: 'Europe/Rome',
          language: 'it',
          license_type: request.licenseType.toLowerCase(),
          estimated_users: request.estimatedUsers,
          business_type: request.businessType,
          contact_person: request.contactPerson
        }
      });
      
      // Aggiungi alla lista delle richieste processate
      setProcessedRequests(prev => new Set([...prev, request.id]));
      
      toast.success(`✅ Organizzazione ${request.organizationName} creata con successo!`);
      console.log('✅ Organizzazione creata con successo');
      
    } catch (error) {
      console.error('❌ Errore creazione organizzazione:', error);
      toast.error(`Errore nella creazione dell'organizzazione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    }
  };

  const handleReject = (requestId: string) => {
    console.log('❌ Rifiuto richiesta:', requestId);
    setProcessedRequests(prev => new Set([...prev, requestId]));
    toast.success('Richiesta rifiutata');
  };

  const handleViewDetails = (request: PendingRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  // Filtra le richieste per nascondere quelle già processate
  const filteredRequests = mockRequests.filter(request => !processedRequests.has(request.id));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Richieste in Sospeso
          </CardTitle>
          <CardDescription>
            Gestisci le richieste di nuove organizzazioni ({filteredRequests.length} richieste)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRequests.length > 0 ? (
            <OrganizationRequestsTable
              requests={filteredRequests}
              onViewDetails={handleViewDetails}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nessuna richiesta in sospeso</p>
              <p className="text-sm">Tutte le richieste sono state processate</p>
            </div>
          )}
        </CardContent>
      </Card>

      <OrganizationRequestModal
        request={selectedRequest}
        open={showRequestModal}
        onOpenChange={setShowRequestModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
};
