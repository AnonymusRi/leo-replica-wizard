
import { Badge } from "@/components/ui/badge";

interface ActiveModulesSectionProps {
  licenseType: string;
}

export const ActiveModulesSection = ({ licenseType }: ActiveModulesSectionProps) => {
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Moduli che verranno attivati</h3>
      <div className="flex flex-wrap gap-2">
        {getActiveModules(licenseType).map((module) => (
          <Badge key={module} variant="secondary">{module}</Badge>
        ))}
      </div>
    </div>
  );
};
