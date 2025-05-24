
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  FileText, 
  Plus, 
  Download, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useAircraftDocuments, useCreateAircraftDocument } from "@/hooks/useAircraftDocuments";
import { format, differenceInDays, parseISO } from "date-fns";

export const DocumentsManager = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string>("");
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({
    aircraft_id: "",
    document_name: "",
    document_type: "",
    document_number: "",
    issue_date: "",
    expiry_date: "",
    issuing_authority: "",
    is_required_for_dispatch: false,
    status: "valid" as "valid" | "expired" | "expiring_soon"
  });

  const { data: aircraft = [] } = useAircraft();
  const { data: documents = [] } = useAircraftDocuments();
  const createDocument = useCreateAircraftDocument();

  // Filter documents by selected aircraft
  const filteredDocuments = documents.filter(doc => 
    !selectedAircraft || doc.aircraft_id === selectedAircraft
  );

  // Document statistics
  const validDocs = filteredDocuments.filter(doc => doc.status === 'valid').length;
  const expiredDocs = filteredDocuments.filter(doc => doc.status === 'expired').length;
  const expiringSoonDocs = filteredDocuments.filter(doc => doc.status === 'expiring_soon').length;
  const dispatchRequiredDocs = filteredDocuments.filter(doc => doc.is_required_for_dispatch).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <AlertTriangle className="w-4 h-4" />;
      case 'expiring_soon': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDaysToExpiry = (expiryDate: string) => {
    if (!expiryDate) return null;
    return differenceInDays(parseISO(expiryDate), new Date());
  };

  const handleCreateDocument = async () => {
    if (!newDocument.aircraft_id || !newDocument.document_name || !newDocument.document_type) {
      return;
    }

    // Determine status based on expiry date
    let status: "valid" | "expired" | "expiring_soon" = "valid";
    if (newDocument.expiry_date) {
      const daysToExpiry = getDaysToExpiry(newDocument.expiry_date);
      if (daysToExpiry !== null) {
        if (daysToExpiry < 0) {
          status = "expired";
        } else if (daysToExpiry <= 30) {
          status = "expiring_soon";
        }
      }
    }

    await createDocument.mutateAsync({
      ...newDocument,
      status
    });

    setIsAddingDocument(false);
    setNewDocument({
      aircraft_id: "",
      document_name: "",
      document_type: "",
      document_number: "",
      issue_date: "",
      expiry_date: "",
      issuing_authority: "",
      is_required_for_dispatch: false,
      status: "valid"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documents Manager</h2>
          <p className="text-gray-600">Manage aircraft documents and track expiry dates</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="border rounded p-2"
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
          >
            <option value="">All Aircraft</option>
            {aircraft.map(plane => (
              <option key={plane.id} value={plane.id}>{plane.tail_number}</option>
            ))}
          </select>

          <Dialog open={isAddingDocument} onOpenChange={setIsAddingDocument}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <select 
                    id="aircraft" 
                    className="w-full border rounded p-2"
                    value={newDocument.aircraft_id}
                    onChange={(e) => setNewDocument({...newDocument, aircraft_id: e.target.value})}
                  >
                    <option value="">Select Aircraft</option>
                    {aircraft.map(plane => (
                      <option key={plane.id} value={plane.id}>{plane.tail_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="docType">Document Type</Label>
                  <select 
                    id="docType" 
                    className="w-full border rounded p-2"
                    value={newDocument.document_type}
                    onChange={(e) => setNewDocument({...newDocument, document_type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="CoA">Certificate of Airworthiness</option>
                    <option value="Radio">Radio License</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Registration">Registration</option>
                    <option value="Manual">Manual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="docName">Document Name</Label>
                  <Input 
                    id="docName" 
                    placeholder="Enter document name"
                    value={newDocument.document_name}
                    onChange={(e) => setNewDocument({...newDocument, document_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="docNumber">Document Number</Label>
                  <Input 
                    id="docNumber" 
                    placeholder="Document number"
                    value={newDocument.document_number}
                    onChange={(e) => setNewDocument({...newDocument, document_number: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="authority">Issuing Authority</Label>
                  <Input 
                    id="authority" 
                    placeholder="Issuing authority"
                    value={newDocument.issuing_authority}
                    onChange={(e) => setNewDocument({...newDocument, issuing_authority: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input 
                    id="issueDate" 
                    type="date"
                    value={newDocument.issue_date}
                    onChange={(e) => setNewDocument({...newDocument, issue_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input 
                    id="expiryDate" 
                    type="date"
                    value={newDocument.expiry_date}
                    onChange={(e) => setNewDocument({...newDocument, expiry_date: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={newDocument.is_required_for_dispatch}
                      onChange={(e) => setNewDocument({...newDocument, is_required_for_dispatch: e.target.checked})}
                    />
                    <span className="text-sm">Required for dispatch</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingDocument(false)}>Cancel</Button>
                <Button onClick={handleCreateDocument} disabled={createDocument.isPending}>
                  {createDocument.isPending ? 'Saving...' : 'Save Document'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export List
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valid Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{validDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringSoonDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{expiredDocs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dispatch Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dispatchRequiredDocs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Document Number</TableHead>
                  <TableHead>Authority</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days to Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dispatch</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const daysToExpiry = doc.expiry_date ? getDaysToExpiry(doc.expiry_date) : null;
                  
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-mono">{doc.aircraft?.tail_number}</TableCell>
                      <TableCell className="font-medium">{doc.document_name}</TableCell>
                      <TableCell>{doc.document_type}</TableCell>
                      <TableCell className="font-mono">{doc.document_number || '-'}</TableCell>
                      <TableCell>{doc.issuing_authority || '-'}</TableCell>
                      <TableCell>
                        {doc.issue_date ? format(parseISO(doc.issue_date), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        {doc.expiry_date ? format(parseISO(doc.expiry_date), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        {daysToExpiry !== null ? (
                          <span className={daysToExpiry < 0 ? 'text-red-600 font-semibold' : daysToExpiry <= 30 ? 'text-yellow-600 font-semibold' : ''}>
                            {daysToExpiry < 0 ? `${Math.abs(daysToExpiry)} days ago` : `${daysToExpiry} days`}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(doc.status)}
                            <span className="ml-1">{doc.status.replace('_', ' ')}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.is_required_for_dispatch ? (
                          <Badge className="bg-red-100 text-red-800">Required</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Optional</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
