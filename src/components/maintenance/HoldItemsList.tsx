
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings
} from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useAircraftHoldItems, useCreateAircraftHoldItem, useUpdateAircraftHoldItem } from "@/hooks/useAircraftHoldItems";
import { format, parseISO } from "date-fns";

export const HoldItemsList = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string>("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    aircraft_id: "",
    item_reference: "",
    item_description: "",
    limitation_description: "",
    date_applied: new Date().toISOString().split('T')[0],
    applied_by: "",
    status: "active" as "active" | "resolved" | "deferred",
    ata_chapter: "",
    mel_reference: ""
  });

  const { data: aircraft = [] } = useAircraft();
  const { data: holdItems = [] } = useAircraftHoldItems();
  const createHoldItem = useCreateAircraftHoldItem();
  const updateHoldItem = useUpdateAircraftHoldItem();

  // Filter hold items by selected aircraft
  const filteredItems = holdItems.filter(item => 
    !selectedAircraft || item.aircraft_id === selectedAircraft
  );

  // Hold items statistics
  const activeItems = filteredItems.filter(item => item.status === 'active').length;
  const resolvedItems = filteredItems.filter(item => item.status === 'resolved').length;
  const deferredItems = filteredItems.filter(item => item.status === 'deferred').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'deferred': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'deferred': return <Clock className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const handleCreateItem = async () => {
    if (!newItem.aircraft_id || !newItem.item_reference || !newItem.item_description) {
      return;
    }

    await createHoldItem.mutateAsync(newItem);

    setIsAddingItem(false);
    setNewItem({
      aircraft_id: "",
      item_reference: "",
      item_description: "",
      limitation_description: "",
      date_applied: new Date().toISOString().split('T')[0],
      applied_by: "",
      status: "active",
      ata_chapter: "",
      mel_reference: ""
    });
  };

  const handleStatusChange = async (itemId: string, newStatus: "active" | "resolved" | "deferred") => {
    const updateData: any = { 
      id: itemId, 
      status: newStatus 
    };

    if (newStatus === 'resolved') {
      updateData.resolution_date = new Date().toISOString().split('T')[0];
    }

    await updateHoldItem.mutateAsync(updateData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hold Items List</h2>
          <p className="text-gray-600">Track aircraft limitations and maintenance deferrals</p>
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

          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Hold Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Hold Item</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <select 
                    id="aircraft" 
                    className="w-full border rounded p-2"
                    value={newItem.aircraft_id}
                    onChange={(e) => setNewItem({...newItem, aircraft_id: e.target.value})}
                  >
                    <option value="">Select Aircraft</option>
                    {aircraft.map(plane => (
                      <option key={plane.id} value={plane.id}>{plane.tail_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="reference">Item Reference</Label>
                  <Input 
                    id="reference" 
                    placeholder="e.g., MEL-32-001"
                    value={newItem.item_reference}
                    onChange={(e) => setNewItem({...newItem, item_reference: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description">Item Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Brief description of the issue"
                    value={newItem.item_description}
                    onChange={(e) => setNewItem({...newItem, item_description: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="limitation">Limitation Description</Label>
                  <textarea 
                    id="limitation" 
                    className="w-full border rounded p-2 h-20"
                    placeholder="Detailed limitation or operational restriction"
                    value={newItem.limitation_description}
                    onChange={(e) => setNewItem({...newItem, limitation_description: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ataChapter">ATA Chapter</Label>
                  <Input 
                    id="ataChapter" 
                    placeholder="e.g., 32"
                    value={newItem.ata_chapter}
                    onChange={(e) => setNewItem({...newItem, ata_chapter: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="melRef">MEL Reference</Label>
                  <Input 
                    id="melRef" 
                    placeholder="e.g., MEL 32-11-01"
                    value={newItem.mel_reference}
                    onChange={(e) => setNewItem({...newItem, mel_reference: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateApplied">Date Applied</Label>
                  <Input 
                    id="dateApplied" 
                    type="date"
                    value={newItem.date_applied}
                    onChange={(e) => setNewItem({...newItem, date_applied: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="appliedBy">Applied By</Label>
                  <Input 
                    id="appliedBy" 
                    placeholder="Person/Department"
                    value={newItem.applied_by}
                    onChange={(e) => setNewItem({...newItem, applied_by: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>Cancel</Button>
                <Button onClick={handleCreateItem} disabled={createHoldItem.isPending}>
                  {createHoldItem.isPending ? 'Saving...' : 'Save Hold Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Deferred Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{deferredItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{filteredItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Hold Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hold Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Limitation</TableHead>
                  <TableHead>ATA Chapter</TableHead>
                  <TableHead>MEL Reference</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Applied By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.aircraft?.tail_number}</TableCell>
                    <TableCell className="font-medium">{item.item_reference}</TableCell>
                    <TableCell>{item.item_description}</TableCell>
                    <TableCell className="max-w-xs truncate" title={item.limitation_description}>
                      {item.limitation_description}
                    </TableCell>
                    <TableCell>{item.ata_chapter || '-'}</TableCell>
                    <TableCell className="font-mono">{item.mel_reference || '-'}</TableCell>
                    <TableCell>
                      {format(parseISO(item.date_applied), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{item.applied_by || '-'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {item.status === 'active' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(item.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(item.id, 'deferred')}
                            >
                              Defer
                            </Button>
                          </>
                        )}
                        {item.status === 'deferred' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(item.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="w-3 h-3" />
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
    </div>
  );
};
