
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportTicket } from "@/hooks/useSupportTickets";

interface UpdateStatusFormProps {
  onUpdateStatus: (status: SupportTicket['status']) => Promise<void>;
  isLoading: boolean;
}

export const UpdateStatusForm = ({ onUpdateStatus, isLoading }: UpdateStatusFormProps) => {
  const [statusUpdate, setStatusUpdate] = useState("");

  const handleUpdateStatus = async () => {
    if (statusUpdate) {
      await onUpdateStatus(statusUpdate as SupportTicket['status']);
      setStatusUpdate("");
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Aggiorna Stato</h4>
      <div className="flex gap-2">
        <Select value={statusUpdate} onValueChange={setStatusUpdate}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleziona nuovo stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Aperto</SelectItem>
            <SelectItem value="in_progress">In Lavorazione</SelectItem>
            <SelectItem value="resolved">Risolto</SelectItem>
            <SelectItem value="closed">Chiuso</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleUpdateStatus}
          disabled={!statusUpdate || isLoading}
        >
          {isLoading ? "Aggiornamento..." : "Aggiorna"}
        </Button>
      </div>
    </div>
  );
};
