
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Mail,
  Settings,
  Plus
} from "lucide-react";
import { useFlightChecklistProgress, useUpdateOpsChecklistProgress } from "@/hooks/useOpsChecklists";

interface FlightChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const FlightChecklistModal = ({ isOpen, onClose, flight }: FlightChecklistModalProps) => {
  const [selectedSection, setSelectedSection] = useState("ops");
  const [notes, setNotes] = useState("");

  const { data: progress = [] } = useFlightChecklistProgress(flight?.id);
  const updateProgress = useUpdateOpsChecklistProgress();

  if (!flight) return null;

  // Mock checklist items basati sulle immagini
  const checklistItems = [
    { id: '1', section: 'ops', name: 'ATC FLIGHT PLAN', status: 'REQUEST', color: 'orange' },
    { id: '2', section: 'ops', name: 'OPERATIONAL FLIGHT PLAN', status: 'Yes', color: 'green' },
    { id: '3', section: 'ops', name: 'OVERFLIGHT PERMIT(S)', status: 'REQUEST', color: 'blue' },
    { id: '4', section: 'ops', name: 'SLOT (EDDB)', status: 'Confirmed', color: 'green' },
    { id: '5', section: 'ops', name: 'SLOT (EGGW)', status: 'Confirmed', color: 'green' },
    { id: '6', section: 'ops', name: 'PARKING', status: 'Not Applicable', color: 'gray' },
    { id: '7', section: 'ops', name: '48 HRS PERMIT BRIEFING', status: 'Yes', color: 'green' },
    { id: '8', section: 'ops', name: 'AIRPORT OPENING (EDDB)', status: 'REQUEST', color: 'blue' },
    { id: '9', section: 'ops', name: 'TRIP APPROVAL', status: 'Completed', color: 'green' },
    { id: '10', section: 'ops', name: 'RELEASED', status: 'Released', color: 'green' },
    { id: '11', section: 'handling', name: 'HANDLING (EDDB)', status: 'Confirmed', color: 'green' },
    { id: '12', section: 'handling', name: 'HANDLING (EGGW)', status: 'Confirmed', color: 'green' },
    { id: '13', section: 'crew', name: 'CREW AWARE OF FLIGHT', status: 'Acknowledged', color: 'green' },
  ];

  const getStatusColor = (status: string, color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'red': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleItemToggle = (itemId: string, completed: boolean) => {
    updateProgress.mutate({
      flight_id: flight.id,
      checklist_item_id: itemId,
      is_completed: completed,
      completed_by: 'Current User',
      notes: notes,
      status: completed ? 'completed' : 'pending',
      color_code: completed ? 'green' : 'gray'
    });
  };

  const filteredItems = checklistItems.filter(item => 
    selectedSection === 'all' || item.section === selectedSection
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Flight Checklist - {flight.flight_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Flight info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Route:</span> {flight.departure_airport} → {flight.arrival_airport}
              </div>
              <div>
                <span className="font-medium">Aircraft:</span> {flight.aircraft?.tail_number || 'TBD'}
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date(flight.departure_time).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <Badge className="ml-2 bg-blue-100 text-blue-800">{flight.status}</Badge>
              </div>
            </div>
          </div>

          {/* Section tabs */}
          <Tabs value={selectedSection} onValueChange={setSelectedSection}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="ops">OPS</TabsTrigger>
              <TabsTrigger value="handling">Handling</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedSection} className="space-y-2">
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={item.status === 'Completed' || item.status === 'Yes' || item.status === 'Confirmed' || item.status === 'Released' || item.status === 'Acknowledged'}
                        onCheckedChange={(checked) => handleItemToggle(item.id, checked as boolean)}
                      />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{item.section}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(item.status, item.color)}>
                        {item.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Progress summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Completed: {filteredItems.filter(i => ['Completed', 'Yes', 'Confirmed', 'Released', 'Acknowledged'].includes(i.status)).length}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="text-sm">Pending: {filteredItems.filter(i => ['REQUEST', 'Not Applicable'].includes(i.status)).length}</span>
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm">Issues: 0</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Notes section */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Textarea
              placeholder="Aggiungi note per questo volo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
