
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Printer,
  Mail,
  Settings
} from "lucide-react";
import { useGenerateDocument } from "@/hooks/useFlightDocuments";

interface DocumentGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const DocumentGenerationModal = ({ isOpen, onClose, flight }: DocumentGenerationModalProps) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("PDF");
  
  const generateDocument = useGenerateDocument();

  if (!flight) return null;

  const documentTypes = [
    { value: "flight_order", label: "Flight Order", description: "Ordine di volo completo" },
    { value: "general_declaration", label: "General Declaration (US)", description: "Dichiarazione generale USA" },
    { value: "general_declaration_with_pax", label: "General Declaration (With PAX)", description: "Dichiarazione generale con passeggeri" },
    { value: "general_declaration_test", label: "General Declaration (Test)", description: "Dichiarazione generale test" },
    { value: "pax_manifest", label: "PAX Manifest", description: "Manifesto passeggeri" },
    { value: "weight_balance", label: "Weight & Balance", description: "Peso e bilanciamento" },
    { value: "pax_trip_sheet", label: "PAX Trip Sheet", description: "Foglio viaggio passeggeri" },
    { value: "billing_sheet", label: "Billing Sheet", description: "Foglio di fatturazione" },
    { value: "master_ticket", label: "Master Ticket", description: "Biglietto principale" }
  ];

  const handleGenerateDocument = () => {
    if (!selectedDocumentType) return;

    const selectedDoc = documentTypes.find(doc => doc.value === selectedDocumentType);
    
    generateDocument.mutate({
      flightId: flight.id,
      documentType: selectedDocumentType,
      templateContent: `Template for ${selectedDoc?.label}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Document Generation - {flight.flight_number}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Generated Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left panel - Document selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Document Type</label>
                  <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((doc) => (
                        <SelectItem key={doc.value} value={doc.value}>
                          {doc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Format</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="XLSX">Excel (XLSX)</SelectItem>
                      <SelectItem value="DOCX">Word (DOCX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedDocumentType && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {documentTypes.find(doc => doc.value === selectedDocumentType)?.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        {documentTypes.find(doc => doc.value === selectedDocumentType)?.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">Available for:</div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Commercial flights</Badge>
                          <Badge variant="outline">Private flights</Badge>
                          <Badge variant="outline">International</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleGenerateDocument}
                    disabled={!selectedDocumentType || generateDocument.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Document
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Right panel - Flight details */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Flight Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Flight:</span> {flight.flight_number}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(flight.departure_time).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Route:</span> {flight.departure_airport} → {flight.arrival_airport}
                      </div>
                      <div>
                        <span className="font-medium">Aircraft:</span> {flight.aircraft?.tail_number || 'TBD'}
                      </div>
                      <div>
                        <span className="font-medium">PAX:</span> {flight.passenger_count}
                      </div>
                      <div>
                        <span className="font-medium">Client:</span> {flight.client?.company_name || 'TBD'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Document Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Include flight crew details</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        <span className="text-sm">Include passenger manifest</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Include weight & balance</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Include fuel planning</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Include weather briefing</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">Document Templates</h3>
              <p>Gestisci i template per la generazione dei documenti</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="text-center text-gray-500 py-8">
              <Download className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">Generated Documents</h3>
              <p>I documenti generati per questo volo appariranno qui</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
