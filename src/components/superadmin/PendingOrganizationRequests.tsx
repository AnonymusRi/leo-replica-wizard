
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Check, X, Eye } from "lucide-react";
import { OrganizationRequestModal } from "./OrganizationRequestModal";

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

const mockRequests: PendingRequest[] = [
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

export const PendingOrganizationRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800">In Revisione</Badge>;
      case "documentation_required":
        return <Badge className="bg-orange-100 text-orange-800">Documentazione Richiesta</Badge>;
      case "ready_for_setup":
        return <Badge className="bg-green-100 text-green-800">Pronto per Setup</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organizzazione</TableHead>
                <TableHead>Contatto</TableHead>
                <TableHead>Data Richiesta</TableHead>
                <TableHead>Tipo Licenza</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.organizationName}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.contactPerson}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.licenseType}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Dettagli
                      </Button>
                      {request.status === 'ready_for_setup' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleApprove(request)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approva
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="w-3 h-3 mr-1" />
                        Rifiuta
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
