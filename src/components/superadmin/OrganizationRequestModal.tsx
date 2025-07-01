
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building } from "lucide-react";
import { useCreateOrganization } from "@/hooks/useCreateOrganization";
import { OrganizationInfoSection } from "./modals/OrganizationInfoSection";
import { LicenseDetailsSection } from "./modals/LicenseDetailsSection";
import { ActiveModulesSection } from "./modals/ActiveModulesSection";
import { OrganizationRequestActions } from "./modals/OrganizationRequestActions";

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
          <OrganizationInfoSection request={request} />
          
          <LicenseDetailsSection 
            licenseType={request.licenseType}
            estimatedUsers={request.estimatedUsers}
            fleetSize={request.fleetSize}
          />

          <ActiveModulesSection licenseType={request.licenseType} />

          {request.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Note</h3>
              <p className="text-sm text-gray-600">{request.notes}</p>
            </div>
          )}

          <OrganizationRequestActions
            onApprove={handleApprove}
            onReject={handleReject}
            onClose={() => onOpenChange(false)}
            isLoading={createOrgMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
