
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

export const DocumentsManager = () => {
  const [selectedAircraft, setSelectedAircraft] = useState("All");
  const [documentTypeFilter, setDocumentTypeFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock documents data based on the image
  const documents = [
    {
      id: "1",
      aircraft: "H-ELMT",
      name: "Air Operator Certificate",
      number: "A3255653442",
      expiryDate: "01-09-2020",
      remains: "-----",
      notes: "",
      status: "expired",
      type: "Certificate",
      isRequired: true
    },
    {
      id: "2",
      aircraft: "H-ELMT",
      name: "FMS",
      number: "FMS123534542",
      expiryDate: "30-09-2020",
      remains: "-----",
      notes: "",
      status: "expired",
      type: "Technical",
      isRequired: false
    },
    {
      id: "3",
      aircraft: "H-ELMT",
      name: "Aircraft Operator's Certificate",
      number: "AOC235563",
      expiryDate: "24-02-2021",
      remains: "-----",
      notes: "",
      status: "expired",
      type: "Certificate",
      isRequired: true
    },
    {
      id: "4",
      aircraft: "H-ELMT",
      name: "Certificate of Airworthiness",
      number: "C23437567634",
      expiryDate: "02-03-2022",
      remains: "3 mo",
      notes: "",
      status: "warning",
      type: "Airworthiness",
      isRequired: true
    },
    {
      id: "5",
      aircraft: "B-ARTI",
      name: "Certificate of Registration",
      number: "123",
      expiryDate: "09-07-2023",
      status: "valid",
      type: "Registration",
      isRequired: true
    },
    {
      id: "6",
      aircraft: "A-BCDE",
      name: "WB",
      number: "123456",
      expiryDate: "09-12-2023",
      remains: "3 month(s)",
      notes: "note",
      status: "valid",
      type: "Weight & Balance",
      isRequired: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <Clock className="w-4 h-4" />;
      case "expired": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const isExpiringWithin30Days = (expiryDate: string) => {
    try {
      const expiry = new Date(expiryDate.split('-').reverse().join('-'));
      const today = new Date();
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    } catch (e) {
      return false;
    }
  };

  const isExpired = (expiryDate: string) => {
    try {
      const expiry = new Date(expiryDate.split('-').reverse().join('-'));
      const today = new Date();
      return expiry < today;
    } catch (e) {
      return false;
    }
  };

  const getDocumentStatus = (doc: any) => {
    if (isExpired(doc.expiryDate)) return "expired";
    if (isExpiringWithin30Days(doc.expiryDate)) return "warning";
    return "valid";
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesAircraft = selectedAircraft === "All" || doc.aircraft === selectedAircraft;
    const matchesType = documentTypeFilter === "All" || doc.type === documentTypeFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAircraft && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Documents Manager</h2>
          <p className="text-gray-600">Manage aircraft documents and track expiry dates</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="aircraft">Aircraft</Label>
                <select id="aircraft" className="w-full border rounded p-2">
                  <option value="H-ELMT">H-ELMT</option>
                  <option value="B-ARTI">B-ARTI</option>
                  <option value="A-BCDE">A-BCDE</option>
                </select>
              </div>
              <div>
                <Label htmlFor="docType">Document Type</Label>
                <select id="docType" className="w-full border rounded p-2">
                  <option value="Certificate">Certificate</option>
                  <option value="Technical">Technical</option>
                  <option value="Airworthiness">Airworthiness</option>
                  <option value="Registration">Registration</option>
                  <option value="Weight & Balance">Weight & Balance</option>
                </select>
              </div>
              <div>
                <Label htmlFor="docName">Document Name</Label>
                <Input id="docName" placeholder="Enter document name" />
              </div>
              <div>
                <Label htmlFor="docNumber">Document Number</Label>
                <Input id="docNumber" placeholder="Enter document number" />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="required" />
                <Label htmlFor="required">Required for dispatch</Label>
              </div>
              <div>
                <Label htmlFor="file">Upload File</Label>
                <Input id="file" type="file" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Upload Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              className="border rounded p-2"
              value={selectedAircraft}
              onChange={(e) => setSelectedAircraft(e.target.value)}
            >
              <option value="All">All Aircraft</option>
              <option value="H-ELMT">H-ELMT</option>
              <option value="B-ARTI">B-ARTI</option>
              <option value="A-BCDE">A-BCDE</option>
            </select>

            <select 
              className="border rounded p-2"
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Certificate">Certificate</option>
              <option value="Technical">Technical</option>
              <option value="Airworthiness">Airworthiness</option>
              <option value="Registration">Registration</option>
              <option value="Weight & Balance">Weight & Balance</option>
            </select>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="showExpired" />
              <Label htmlFor="showExpired" className="text-sm">Show expired only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="showRequired" />
              <Label htmlFor="showRequired" className="text-sm">Required for dispatch</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Remains</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const status = getDocumentStatus(doc);
                  return (
                    <TableRow key={doc.id} className={status === 'expired' ? 'bg-red-50' : status === 'warning' ? 'bg-yellow-50' : ''}>
                      <TableCell className="font-mono font-medium">{doc.aircraft}</TableCell>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell className="font-mono">{doc.number}</TableCell>
                      <TableCell>{doc.expiryDate}</TableCell>
                      <TableCell>{doc.remains || "-----"}</TableCell>
                      <TableCell>{doc.notes || "-----"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(status)}>
                          {getStatusIcon(status)}
                          <span className="ml-1 capitalize">{status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.isRequired ? (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Required
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Optional</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" title="View">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="History">
                            <FileText className="w-4 h-4" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(doc => getDocumentStatus(doc) === 'expired').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(doc => getDocumentStatus(doc) === 'warning').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Required for Dispatch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {documents.filter(doc => doc.isRequired).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
