
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Download, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DocumentGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight?: any;
}

export const DocumentGenerationModal = ({ isOpen, onClose, flight }: DocumentGenerationModalProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const documentTypes = [
    {
      id: "flight_plan",
      name: "Piano di Volo",
      description: "Documento ufficiale del piano di volo",
      required: true,
      status: "pending"
    },
    {
      id: "weight_balance",
      name: "Weight & Balance",
      description: "Calcolo peso e bilanciamento",
      required: true,
      status: "completed"
    },
    {
      id: "crew_briefing",
      name: "Crew Briefing",
      description: "Briefing per l'equipaggio",
      required: false,
      status: "pending"
    },
    {
      id: "passenger_manifest",
      name: "Passenger Manifest",
      description: "Lista passeggeri",
      required: true,
      status: "pending"
    },
    {
      id: "fuel_slip",
      name: "Fuel Slip",
      description: "Documento carburante",
      required: true,
      status: "pending"
    },
    {
      id: "customs_declaration",
      name: "Dichiarazione Doganale",
      description: "Per voli internazionali",
      required: false,
      status: "not_applicable"
    }
  ];

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleGenerateDocuments = async () => {
    if (selectedDocuments.length === 0) {
      toast.error("Seleziona almeno un documento da generare");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simula la generazione dei documenti
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setGenerationProgress(i);
      }

      toast.success(`${selectedDocuments.length} documenti generati con successo`);
      setSelectedDocuments([]);
    } catch (error) {
      toast.error("Errore nella generazione dei documenti");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'not_applicable':
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string, required: boolean) => {
    if (status === 'completed') {
      return <Badge variant="secondary" className="text-green-700 bg-green-100">Completato</Badge>;
    }
    if (status === 'not_applicable') {
      return <Badge variant="outline">N/A</Badge>;
    }
    if (required) {
      return <Badge variant="destructive">Obbligatorio</Badge>;
    }
    return <Badge variant="outline">Opzionale</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generazione Documenti
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Volo:</span> {flight.flight_number}
                  </div>
                  <div>
                    <span className="font-medium">Rotta:</span> {flight.departure_airport} → {flight.arrival_airport}
                  </div>
                  <div>
                    <span className="font-medium">Data:</span> {new Date(flight.departure_time).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Aeromobile:</span> {flight.aircraft?.tail_number || 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {isGenerating && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Generazione in corso...</span>
                    <span className="text-sm text-gray-500">{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Documenti Disponibili</h3>
            
            {documentTypes.map((doc) => (
              <Card key={doc.id} className={`cursor-pointer transition-colors ${
                selectedDocuments.includes(doc.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={doc.id}
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => handleDocumentToggle(doc.id)}
                      disabled={doc.status === 'completed' || doc.status === 'not_applicable'}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(doc.status)}
                        <label htmlFor={doc.id} className="font-medium cursor-pointer">
                          {doc.name}
                        </label>
                        {getStatusBadge(doc.status, doc.required)}
                      </div>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>

                    {doc.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Nota Importante</span>
            </div>
            <p className="text-sm text-amber-600 mt-1">
              I documenti obbligatori devono essere generati prima del decollo.
              Assicurati che tutte le informazioni del volo siano corrette.
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Chiudi
          </Button>
          <div className="space-x-2">
            <Button variant="outline" disabled={isGenerating}>
              Anteprima
            </Button>
            <Button 
              onClick={handleGenerateDocuments} 
              disabled={isGenerating || selectedDocuments.length === 0}
            >
              {isGenerating ? "Generazione..." : `Genera ${selectedDocuments.length} Documenti`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
