
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface OrganizationRequestActionsProps {
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export const OrganizationRequestActions = ({ 
  onApprove, 
  onReject, 
  onClose, 
  isLoading 
}: OrganizationRequestActionsProps) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t">
      <Button variant="outline" onClick={onClose}>
        Chiudi
      </Button>
      <Button 
        variant="destructive" 
        onClick={onReject}
        disabled={isLoading}
      >
        <X className="w-4 h-4 mr-2" />
        Rifiuta
      </Button>
      <Button 
        onClick={onApprove}
        disabled={isLoading}
      >
        <Check className="w-4 h-4 mr-2" />
        {isLoading ? 'Creazione...' : 'Approva e Crea'}
      </Button>
    </div>
  );
};
