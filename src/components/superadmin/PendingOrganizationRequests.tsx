
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { OrganizationRequestModal } from "./OrganizationRequestModal";
import { OrganizationRequestsTable } from "./requests/OrganizationRequestsTable";
import { mockRequests } from "./requests/mockRequestsData";

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

  const handleApprove = (request: PendingRequest) => {
    console.log('Approving request:', request);
    // Qui implementeremo la logica per approvare e creare l'organizzazione
  };

  const handleReject = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // Qui implementeremo la logica per rifiutare la richiesta
  };

  const handleViewDetails = (request: PendingRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Richieste in Sospeso
          </CardTitle>
          <CardDescription>
            Gestisci le richieste di nuove organizzazioni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationRequestsTable
            requests={mockRequests}
            onViewDetails={handleViewDetails}
            onApprove={handleApprove}
            onReject={handleReject}
          />
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
