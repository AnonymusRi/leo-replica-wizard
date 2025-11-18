
import { Badge } from "@/components/ui/badge";

interface LicenseDetailsProps {
  licenseType: string;
  estimatedUsers: number;
  fleetSize?: number;
}

export const LicenseDetailsSection = ({ licenseType, estimatedUsers, fleetSize }: LicenseDetailsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dettagli Licenza</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="font-medium">Tipo Licenza</div>
          <Badge variant="outline">{licenseType}</Badge>
        </div>
        <div>
          <div className="font-medium">Utenti Stimati</div>
          <div className="text-lg">{estimatedUsers}</div>
        </div>
        {fleetSize && (
          <div>
            <div className="font-medium">Dimensione Flotta</div>
            <div className="text-lg">{fleetSize}</div>
          </div>
        )}
      </div>
    </div>
  );
};
