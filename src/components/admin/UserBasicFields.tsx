
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserBasicFieldsProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
  };
  onFormDataChange: (updates: Partial<UserBasicFieldsProps['formData']>) => void;
  isEmailDisabled?: boolean;
}

export const UserBasicFields = ({ formData, onFormDataChange, isEmailDisabled }: UserBasicFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">Nome</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => onFormDataChange({ first_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name">Cognome</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => onFormDataChange({ last_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ email: e.target.value })}
          disabled={isEmailDisabled}
          required
        />
      </div>
    </>
  );
};
