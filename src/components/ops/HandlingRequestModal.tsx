
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, Clock } from "lucide-react";
import { toast } from "sonner";

interface HandlingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight?: any;
}

export const HandlingRequestModal = ({ isOpen, onClose, flight }: HandlingRequestModalProps) => {
  const [serviceType, setServiceType] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const serviceTypes = [
    "Ground Handling",
    "Fueling",
    "Catering",
    "Passenger Services",
    "Baggage Handling",
    "Aircraft Cleaning",
    "GPU/ASU Services",
    "Security Services"
  ];

  const handleSubmitRequest = async () => {
    if (!serviceType || !requestDetails) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    try {
      // Qui implementeresti la logica per inviare la richiesta
      toast.success("Richiesta di handling inviata con successo");
      onClose();
    } catch (error) {
      toast.error("Errore nell'invio della richiesta");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Richiesta Handling
            {flight && ` - ${flight.flight_number}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {flight && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dettagli Volo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Volo:</span> {flight.flight_number}
                  </div>
                  <div>
                    <span className="font-medium">Aeroporto:</span> {flight.departure_airport}
                  </div>
                  <div>
                    <span className="font-medium">Data/Ora:</span> {new Date(flight.departure_time).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Aeromobile:</span> {flight.aircraft?.tail_number || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo di Servizio *
              </label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo di servizio" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Dettagli Richiesta *
              </label>
              <Textarea
                placeholder="Descrivi in dettaglio i servizi richiesti..."
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Richieste Speciali
              </label>
              <Textarea
                placeholder="Eventuali richieste speciali o note aggiuntive..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email di Contatto
              </label>
              <Input
                type="email"
                placeholder="Il tuo indirizzo email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Tempi di Risposta</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Le richieste di handling vengono processate entro 2-4 ore lavorative.
              Per urgenze, contattare direttamente l'handling agent.
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button onClick={handleSubmitRequest} className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Invia Richiesta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
