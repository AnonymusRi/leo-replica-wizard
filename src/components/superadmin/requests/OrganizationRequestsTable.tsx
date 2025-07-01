
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";
import { RequestStatusBadge } from "./RequestStatusBadge";

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

interface OrganizationRequestsTableProps {
  requests: PendingRequest[];
  onViewDetails: (request: PendingRequest) => void;
  onApprove: (request: PendingRequest) => void;
  onReject: (requestId: string) => void;
}

export const OrganizationRequestsTable = ({ 
  requests, 
  onViewDetails, 
  onApprove, 
  onReject 
}: OrganizationRequestsTableProps) => {
  return (
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
        {requests.map((request) => (
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
              <RequestStatusBadge status={request.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(request)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Dettagli
                </Button>
                {request.status === 'ready_for_setup' && (
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onApprove(request)}
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Approva
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onReject(request.id)}
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
  );
};
