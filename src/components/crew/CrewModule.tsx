
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Filter, 
  Plus, 
  AlertTriangle,
  Calendar,
  Clock,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { CrewModal } from "./CrewModal";
import { format, isAfter, parseISO, addDays } from "date-fns";

export const CrewModule = () => {
  const [showCrewModal, setShowCrewModal] = useState(false);
  const { data: crewMembers = [], isLoading, error } = useCrewMembers();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        Errore nel caricamento dei membri dell'equipaggio: {error.message}
      </div>
    );
  }

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "captain": return "Comandante";
      case "first_officer": return "Primo Ufficiale";
      case "cabin_crew": return "Assistente di Volo";
      case "mechanic": return "Meccanico";
      default: return position;
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "captain": return "bg-blue-100 text-blue-800";
      case "first_officer": return "bg-indigo-100 text-indigo-800";
      case "cabin_crew": return "bg-purple-100 text-purple-800";
      case "mechanic": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isExpiringSoon = (dateStr?: string | null) => {
    if (!dateStr) return false;
    try {
      const date = parseISO(dateStr);
      const thirtyDaysFromNow = addDays(new Date(), 30);
      return isAfter(thirtyDaysFromNow, date);
    } catch (e) {
      return false;
    }
  };

  const activeCrew = crewMembers.filter(cm => cm.is_active).length;
  const captains = crewMembers.filter(cm => cm.position === "captain" && cm.is_active).length;
  const firstOfficers = crewMembers.filter(cm => cm.position === "first_officer" && cm.is_active).length;
  const cabinCrew = crewMembers.filter(cm => cm.position === "cabin_crew" && cm.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Crew Management</h1>
          <p className="text-gray-600">Gestione personale di volo e tecnico</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
          <Button 
            onClick={() => setShowCrewModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Membro
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Equipaggio Attivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeCrew}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Comandanti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{captains}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Primi Ufficiali</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{firstOfficers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Assistenti di Volo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{cabinCrew}</div>
          </CardContent>
        </Card>
      </div>

      {/* Crew Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Elenco Equipaggio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Posizione</TableHead>
                <TableHead>Licenza</TableHead>
                <TableHead>Scad. Licenza</TableHead>
                <TableHead>Scad. Visita</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Contatti</TableHead>
                <TableHead>Stato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewMembers.map((crew) => (
                <TableRow key={crew.id} className={crew.is_active ? "" : "bg-gray-50 text-gray-500"}>
                  <TableCell className="font-medium">
                    {crew.first_name} {crew.last_name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPositionColor(crew.position)}>
                      {getPositionLabel(crew.position)}
                    </Badge>
                  </TableCell>
                  <TableCell>{crew.license_number || "-"}</TableCell>
                  <TableCell>
                    {crew.license_expiry ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        <span className={isExpiringSoon(crew.license_expiry) ? "text-red-600 font-medium" : ""}>
                          {format(new Date(crew.license_expiry), "dd/MM/yyyy")}
                        </span>
                        {isExpiringSoon(crew.license_expiry) && (
                          <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                        )}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    {crew.medical_expiry ? (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        <span className={isExpiringSoon(crew.medical_expiry) ? "text-red-600 font-medium" : ""}>
                          {format(new Date(crew.medical_expiry), "dd/MM/yyyy")}
                        </span>
                        {isExpiringSoon(crew.medical_expiry) && (
                          <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                        )}
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>{crew.base_location || "-"}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1 text-sm">
                      {crew.email && (
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{crew.email}</span>
                        </div>
                      )}
                      {crew.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          <span>{crew.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={crew.is_active ? "default" : "secondary"}>
                      {crew.is_active ? "Attivo" : "Inattivo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {crewMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nessun membro dell'equipaggio presente
            </div>
          )}
        </CardContent>
      </Card>

      <CrewModal open={showCrewModal} onOpenChange={setShowCrewModal} />
    </div>
  );
};
