
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Send } from "lucide-react";
import { CrewValidationResult } from "@/types/certification";
import { useCreateEnacNotification } from "@/hooks/useCrewCertifications";

interface ForceAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  validationResult: CrewValidationResult;
  crewMemberId: string;
  flightId: string;
  crewMemberName: string;
}

export const ForceAssignmentModal = ({
  isOpen,
  onClose,
  onConfirm,
  validationResult,
  crewMemberId,
  flightId,
  crewMemberName
}: ForceAssignmentModalProps) => {
  const [justification, setJustification] = useState("");
  const createEnacNotification = useCreateEnacNotification();

  const handleForceAssignment = async () => {
    if (!justification.trim()) {
      return;
    }

    // Create ENAC notification for each expired certification
    for (const expiredCert of validationResult.expiredCertifications) {
      await createEnacNotification.mutateAsync({
        crew_member_id: crewMemberId,
        flight_id: flightId,
        expired_certification_type: expiredCert.certification_type,
        justification: justification.trim(),
        sent_by: "Operations",
        status: 'pending'
      });
    }

    onConfirm();
    onClose();
    setJustification("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Forzatura Assegnazione Equipaggio</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-800 mb-2">
              Certificazioni Scadute per {crewMemberName}
            </h3>
            <ul className="space-y-1">
              {validationResult.expiredCertifications.map((cert) => (
                <li key={cert.id} className="text-sm text-orange-700">
                  • {cert.certification_type} 
                  {cert.expiry_date && (
                    <span className="ml-2 text-xs">
                      (scaduta il {new Date(cert.expiry_date).toLocaleDateString('it-IT')})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">Errori di Validazione</h3>
            <ul className="space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">• {error}</li>
              ))}
            </ul>
          </div>

          <div>
            <Label htmlFor="justification">
              Motivazione per ENAC (Obbligatoria)
            </Label>
            <Textarea
              id="justification"
              placeholder="Inserisci la motivazione dettagliata per la forzatura dell'assegnazione..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Procedendo con la forzatura verrà automaticamente inviata una 
              notifica all'ENAC con la motivazione indicata. Il volo e l'equipaggio saranno registrati 
              nel sistema di notifiche.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button
              onClick={handleForceAssignment}
              disabled={!justification.trim() || createEnacNotification.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {createEnacNotification.isPending ? 'Elaborazione...' : 'Forza Assegnazione'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
