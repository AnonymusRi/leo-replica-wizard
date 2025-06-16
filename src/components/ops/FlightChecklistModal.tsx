
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, AlertTriangle, FileText } from "lucide-react";
import { useOpsChecklists, useFlightChecklistProgress } from "@/hooks/useOpsChecklists";
import { toast } from "sonner";

interface FlightChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const FlightChecklistModal = ({ isOpen, onClose, flight }: FlightChecklistModalProps) => {
  const [notes, setNotes] = useState("");
  const { data: checklists = [] } = useOpsChecklists();
  const { data: progress = [], mutate: updateProgress } = useFlightChecklistProgress(flight?.id);

  const handleChecklistItemToggle = async (itemId: string, completed: boolean) => {
    try {
      // Qui dovresti implementare la logica per aggiornare il progresso
      toast.success(completed ? "Item completato" : "Item marcato come da completare");
    } catch (error) {
      toast.error("Errore nell'aggiornamento");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!flight) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Flight Checklist - {flight.flight_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dettagli Volo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Partenza:</span>
                  <div>{flight.departure_airport}</div>
                </div>
                <div>
                  <span className="font-medium">Arrivo:</span>
                  <div>{flight.arrival_airport}</div>
                </div>
                <div>
                  <span className="font-medium">Data:</span>
                  <div>{new Date(flight.departure_time).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant="outline">{flight.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Checklist Operativa</h3>
            
            {checklists.map((checklist) => (
              <Card key={checklist.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{checklist.name}</span>
                    {getStatusIcon('pending')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {checklist.items?.map((item: any) => (
                    <div key={item.id} className="flex items-start gap-3 p-2 border rounded">
                      <Checkbox
                        id={item.id}
                        onCheckedChange={(checked) => 
                          handleChecklistItemToggle(item.id, !!checked)
                        }
                      />
                      <label htmlFor={item.id} className="flex-1 text-sm cursor-pointer">
                        {item.item_text}
                        {item.is_required && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Obbligatorio
                          </Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Note Aggiuntive</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Aggiungi note per questo volo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
          <div className="space-x-2">
            <Button variant="outline">
              Salva Bozza
            </Button>
            <Button>
              Completa Checklist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
