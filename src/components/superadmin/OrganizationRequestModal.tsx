
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Building, User, Mail, Phone, MapPin, Package } from "lucide-react";
import { useCreateOrganization } from "@/hooks/useCreateOrganization";

interface OrganizationRequest {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requestDate: string;
  licenseType: string;
  estimatedUsers: number;
  status: string;
  businessType?: string;
  fleetSize?: number;
  city?: string;
  country?: string;
  notes?: string;
}

interface OrganizationRequestModalProps {
  request: OrganizationRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (request: OrganizationRequest) => void;
  onReject: (requestId: string) => void;
}

export const OrganizationRequestModal = ({ 
  request, 
  open, 
  onOpenChange, 
  onApprove, 
  onReject 
}: OrganizationRequestModalProps) => {
  const createOrgMutation = useCreateOrganization();

  if (!request) return null;

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

  const handleApprove = async () => {
    try {
      await createOrgMutation.mutateAsync({
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
          business_type: request.businessType
        }
      });
      
      onApprove(request);
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving organization:', error);
    }
  };

  const handleReject = () => {
    onReject(request.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Dettagli Richiesta Organizzazione
          </DialogTitle>
          <DialogDescription>
            Revisiona i dettagli prima di approvare o rifiutare la richiesta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informazioni Organizzazione */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informazioni Organizzazione</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">{request.organizationName}</div>
                  <div className="text-sm text-gray-500">Nome organizzazione</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">{request.contactPerson}</div>
                  <div className="text-sm text-gray-500">Referente</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">{request.email}</div>
                  <div className="text-sm text-gray-500">Email</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">{request.phone}</div>
                  <div className="text-sm text-gray-500">Telefono</div>
                </div>
              </div>
              {(request.city || request.country) && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {request.city}{request.city && request.country && ', '}{request.country}
                    </div>
                    <div className="text-sm text-gray-500">Ubicazione</div>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="font-medium">{request.businessType}</div>
                  <div className="text-sm text-gray-500">Tipo business</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dettagli Licenza */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dettagli Licenza</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-medium">Tipo Licenza</div>
                <Badge variant="outline">{request.licenseType}</Badge>
              </div>
              <div>
                <div className="font-medium">Utenti Stimati</div>
                <div className="text-lg">{request.estimatedUsers}</div>
              </div>
              {request.fleetSize && (
                <div>
                  <div className="font-medium">Dimensione Flotta</div>
                  <div className="text-lg">{request.fleetSize}</div>
                </div>
              )}
            </div>
          </div>

          {/* Moduli Attivi Previsti */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Moduli che verranno attivati</h3>
            <div className="flex flex-wrap gap-2">
              {getActiveModules(request.licenseType).map((module) => (
                <Badge key={module} variant="secondary">{module}</Badge>
              ))}
            </div>
          </div>

          {request.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Note</h3>
              <p className="text-sm text-gray-600">{request.notes}</p>
            </div>
          )}

          {/* Azioni */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Chiudi
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={createOrgMutation.isPending}
            >
              <X className="w-4 h-4 mr-2" />
              Rifiuta
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={createOrgMutation.isPending}
            >
              <Check className="w-4 h-4 mr-2" />
              {createOrgMutation.isPending ? 'Creazione...' : 'Approva e Crea'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
