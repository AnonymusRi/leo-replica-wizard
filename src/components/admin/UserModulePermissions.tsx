
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { SystemModule } from "@/types/user-roles";

interface UserModulePermissionsProps {
  modulePermissions: SystemModule[];
  onModuleChange: (module: SystemModule, checked: boolean) => void;
}

const AVAILABLE_MODULES: SystemModule[] = [
  'SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 
  'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'
];

export const UserModulePermissions = ({ modulePermissions, onModuleChange }: UserModulePermissionsProps) => {
  return (
    <div>
      <Label>Permessi Moduli</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {AVAILABLE_MODULES.map((module) => (
          <div key={module} className="flex items-center space-x-2">
            <Checkbox
              id={module}
              checked={modulePermissions.includes(module)}
              onCheckedChange={(checked) => onModuleChange(module, checked as boolean)}
            />
            <Label htmlFor={module} className="text-sm">
              {module}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
