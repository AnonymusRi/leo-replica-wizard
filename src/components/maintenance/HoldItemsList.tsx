
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Trash2,
  FileText,
  Calendar
} from "lucide-react";

export const HoldItemsList = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState("D-JANF");

  // Mock hold items data based on the image
  const holdItems = [
    {
      id: "01-04",
      melItemNo: "-",
      acft: "D-JANA",
      date: "",
      hilItemNo: "02 16",
      melItemNoAlt: "AMM",
      dateAlt: "17 Apr 2023",
      foundBy: "MXX",
      discrepancyDescription: "LH WINDSHIELD DELAMINATION - IN LIMIT - REPLACEMENT NEEDED IF THE DAMAGE IMPAIRS",
      flightLimit: "Yes",
      status: "Closed",
      limitExtension: "CLOSE TO ORDER, DUE TO BBD LETTER 45-590- MSG ITEM 26 HAVE BEEN REPLACED TO P/N MS35842- INSP (FH) INTERV WITHIN 12 MO OR 240 FL, WHICHEVER COMES"
    },
    {
      id: "01-17",
      melItemNo: "05-14-00-800-80",
      acft: "D-JANB",
      hilItemNo: "",
      discrepancyDescription: "",
      flightLimit: "Yes",
      status: "Open"
    },
    {
      id: "01-05",
      melItemNo: "05-14-00-800-80",
      acft: "D-JANC",
      discrepancyDescription: "",
      flightLimit: "Yes",
      status: "Closed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800";
      case "Closed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <AlertTriangle className="w-4 h-4" />;
      case "Closed": return <CheckCircle className="w-4 h-4" />;
      case "Pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hold Item List (HIL)</h2>
          <p className="text-gray-600">Aircraft limitations and maintenance deferrals</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="border rounded p-2"
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
          >
            <option value="">All Aircraft</option>
            <option value="D-JANF">D-JANF</option>
            <option value="D-JANA">D-JANA</option>
            <option value="D-JANB">D-JANB</option>
            <option value="D-JANC">D-JANC</option>
          </select>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New HIL
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Hold Item</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <select id="aircraft" className="w-full border rounded p-2">
                    <option value="D-JANF">D-JANF</option>
                    <option value="D-JANA">D-JANA</option>
                    <option value="D-JANB">D-JANB</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="hilItemNo">HIL Item No.</Label>
                  <Input id="hilItemNo" placeholder="02 16" />
                </div>
                <div>
                  <Label htmlFor="melItemNo">MEL Item No.</Label>
                  <Input id="melItemNo" placeholder="AMM" />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="foundBy">Found by</Label>
                  <Input id="foundBy" placeholder="MXX" />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="discrepancy">Discrepancy Description</Label>
                  <Textarea 
                    id="discrepancy" 
                    placeholder="Enter detailed description of the discrepancy"
                    rows={3}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="limitations">Flight Limitations</Label>
                  <Textarea 
                    id="limitations" 
                    placeholder="Enter flight limitations if any"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="entryType">Entry Type</Label>
                  <select id="entryType" className="w-full border rounded p-2">
                    <option value="WORK_DEFERRED">WORK DEFERRED</option>
                    <option value="MEL_ITEM">MEL ITEM</option>
                    <option value="CDL_ITEM">CDL ITEM</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select id="category" className="w-full border rounded p-2">
                    <option value="NONE">NONE</option>
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                    <option value="C">Category C</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddModalOpen(false)}>
                  Save HIL Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HIL Item No.</TableHead>
                  <TableHead>MEL Item No.</TableHead>
                  <TableHead>ACFT</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Extension Due Date</TableHead>
                  <TableHead>Discrepancy Description</TableHead>
                  <TableHead>Flight Limit.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell className="font-mono text-sm">{item.melItemNo || "-"}</TableCell>
                    <TableCell className="font-mono">{item.acft}</TableCell>
                    <TableCell>{item.dateAlt || item.date || "-"}</TableCell>
                    <TableCell>{item.limitExtension ? "30 Apr 2023" : "-"}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={item.discrepancyDescription}>
                        {item.discrepancyDescription || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.flightLimit === "Yes" ? (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Yes
                        </Badge>
                      ) : (
                        <span>No</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total HIL Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Open Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {holdItems.filter(item => item.status === 'Open').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Closed Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {holdItems.filter(item => item.status === 'Closed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">With Flight Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {holdItems.filter(item => item.flightLimit === 'Yes').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
