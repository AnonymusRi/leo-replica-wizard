
import { Building, User, Mail, Phone, MapPin, Package } from "lucide-react";

interface OrganizationRequest {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType?: string;
  city?: string;
  country?: string;
}

interface OrganizationInfoSectionProps {
  request: OrganizationRequest;
}

export const OrganizationInfoSection = ({ request }: OrganizationInfoSectionProps) => {
  return (
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
  );
};
