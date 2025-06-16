
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Plus, 
  X, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { useFlightAssignmentsByFlight, useCreateFlightAssignment, useDeleteFlightAssignment } from "@/hooks/useFlightAssignments";
import { useAssignCrewToFlight } from "@/hooks/useCrewFlightAssignments";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";

interface CrewAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: any;
}

export const CrewAssignmentModal = ({ isOpen, onClose, flight }: CrewAssignmentModalProps) => {
  const [selectedCrewMember, setSelectedCrewMember] = useState<string>("");
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [reportingTime, setReportingTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();
  const { data: flightAssignments = [], isLoading: assignmentsLoading } = useFlightAssignmentsByFlight(flight?.id);
  const createAssignment = useCreateFlightAssignment();
  const deleteAssignment = useDeleteFlightAssignment();
  const assignCrewToFlight = useAssignCrewToFlight();

  const positions = [
    { value: "captain", label: "Captain" },
    { value: "first_officer", label: "First Officer" },
    { value: "cabin_crew", label: "Cabin Crew" },
    { value: "mechanic", label: "Mechanic" }
  ];

  const handleAssignCrew = async () => {
    if (!selectedCrewMember || !selectedPosition) {
      toast.error("Seleziona un membro dell'equipaggio e una posizione");
      return;
    }

    try {
      // Usa il nuovo hook per l'assegnazione con validazioni FTL
      await assignCrewToFlight.mutateAsync({
        flight_id: flight.id,
        crew_member_id: selectedCrewMember,
        position: selectedPosition,
        reporting_time: reportingTime || undefined,
        duty_start_time: flight.departure_time,
        duty_end_time: flight.arrival_time,
        assigned_by: "Operations",
        notes: notes || undefined
      });

      // Reset form
      setSelectedCrewMember("");
      setSelectedPosition("");
      setReportingTime("");
      setNotes("");
    } catch (error) {
      console.error('Error assigning crew:', error);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      await deleteAssignment.mutateAsync(assignmentId);
    } catch (error) {
      console.error('Error removing assignment:', error);
    }
  };

  const getPositionBadgeColor = (position: string) => {
    switch (position) {
      case "captain": return "bg-blue-100 text-blue-800";
      case "first_officer": return "bg-green-100 text-green-800";
      case "cabin_crew": return "bg-purple-100 text-purple-800";
      case "mechanic": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCrewMemberName = (crewMemberId: string) => {
    const member = crewMembers.find(c => c.id === crewMemberId);
    return member ? `${member.first_name} ${member.last_name}` : "Unknown";
  };

  if (!flight) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Crew Assignment - Flight {flight.flight_number}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Flight Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Flight Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Route:</span>
                  <div>{flight.departure_airport} → {flight.arrival_airport}</div>
                </div>
                <div>
                  <span className="font-medium">Departure:</span>
                  <div>{format(new Date(flight.departure_time), "dd/MM/yyyy HH:mm", { locale: it })}</div>
                </div>
                <div>
                  <span className="font-medium">Arrival:</span>
                  <div>{format(new Date(flight.arrival_time), "dd/MM/yyyy HH:mm", { locale: it })}</div>
                </div>
                <div>
                  <span className="font-medium">Passengers:</span>
                  <div>{flight.passenger_count || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Assignments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current Crew Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {assignmentsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : flightAssignments.length > 0 ? (
                <div className="space-y-3">
                  {flightAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className={getPositionBadgeColor(assignment.position)}>
                          {assignment.position}
                        </Badge>
                        <div>
                          <div className="font-medium">
                            {assignment.crew_member ? 
                              `${assignment.crew_member.first_name} ${assignment.crew_member.last_name}` :
                              getCrewMemberName(assignment.crew_member_id || '')
                            }
                          </div>
                          {assignment.notes && (
                            <div className="text-sm text-gray-500">{assignment.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nessun equipaggio assegnato</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Assignment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Assign New Crew Member</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="crew-member">Crew Member</Label>
                  <Select value={selectedCrewMember} onValueChange={setSelectedCrewMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crew member" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewMembers
                        .filter(member => member.is_active)
                        .map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.first_name} {member.last_name} - {member.position}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position.value} value={position.value}>
                          {position.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reporting-time">Reporting Time (Optional)</Label>
                <Input
                  id="reporting-time"
                  type="datetime-local"
                  value={reportingTime}
                  onChange={(e) => setReportingTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleAssignCrew}
                disabled={!selectedCrewMember || !selectedPosition || assignCrewToFlight.isPending}
                className="w-full"
              >
                {assignCrewToFlight.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Crew Member
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* FTL Compliance Warning */}
          <Card className="border-orange-200">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="text-sm text-orange-700">
                  <p className="font-medium">FTL Compliance Note</p>
                  <p>Le assegnazioni vengono automaticamente validate contro i limiti FTL. Eventuali violazioni saranno segnalate.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
