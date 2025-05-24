
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Wrench, 
  Filter, 
  Plus, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  CircleDollarSign,
  Plane,
  User,
  Loader2
} from "lucide-react";
import { format, isAfter, isBefore, parseISO, addDays } from "date-fns";

export const MaintenanceModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Questo sarà sostituito con una chiamata alla hook useMaintenanceRecords quando la implementeremo
  const maintenanceRecords = [
    {
      id: "1",
      maintenance_type: "100-Hour Inspection",
      description: "Ispezione regolare di 100 ore",
      scheduled_date: "2025-05-30",
      status: "scheduled",
      aircraft: { tail_number: "N123AB", aircraft_type: "Citation X" },
      technician: { first_name: "Mike", last_name: "Brown" },
      cost: 3500,
    },
    {
      id: "2",
      maintenance_type: "Annual Inspection",
      description: "Ispezione annuale completa",
      scheduled_date: "2025-05-20",
      status: "overdue",
      aircraft: { tail_number: "N456CD", aircraft_type: "Falcon 7X" },
      technician: null,
      cost: 12000,
    },
    {
      id: "3",
      maintenance_type: "Engine Overhaul",
      description: "Revisione completa del motore sinistro",
      scheduled_date: "2025-06-10",
      status: "in_progress",
      aircraft: { tail_number: "N789EF", aircraft_type: "Gulfstream G650" },
      technician: { first_name: "Mike", last_name: "Brown" },
      cost: 95000,
    },
    {
      id: "4",
      maintenance_type: "Avionics Update",
      description: "Aggiornamento del sistema avionico",
      scheduled_date: "2025-04-15",
      completed_date: "2025-04-16",
      status: "completed",
      aircraft: { tail_number: "N123AB", aircraft_type: "Citation X" },
      technician: { first_name: "Mike", last_name: "Brown" },
      cost: 15000,
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled": return "Programmato";
      case "in_progress": return "In Corso";
      case "completed": return "Completato";
      case "overdue": return "Scaduto";
      default: return status;
    }
  };

  const isOverdueOrDueSoon = (dateStr?: string, status?: string) => {
    if (!dateStr || status === 'completed') return false;
    try {
      const date = parseISO(dateStr);
      const today = new Date();
      const sevenDaysFromNow = addDays(today, 7);
      
      if (isBefore(date, today)) return "overdue";
      if (isBefore(date, sevenDaysFromNow)) return "due-soon";
      return false;
    } catch (e) {
      return false;
    }
  };

  const scheduledCount = maintenanceRecords.filter(m => m.status === 'scheduled').length;
  const inProgressCount = maintenanceRecords.filter(m => m.status === 'in_progress').length;
  const completedCount = maintenanceRecords.filter(m => m.status === 'completed').length;
  const overdueCount = maintenanceRecords.filter(m => m.status === 'overdue').length;

  const totalPlannedCost = maintenanceRecords
    .filter(m => m.status !== 'completed')
    .reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manutenzione Aeromobili</h1>
          <p className="text-gray-600">Gestione e pianificazione attività di manutenzione</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtri
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuova Manutenzione
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Programmati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{scheduledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Corso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Scaduti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Costi Pianificati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">€{totalPlannedCost.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Registro Manutenzioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Aeromobile</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead>Data Programmata</TableHead>
                  <TableHead>Tecnico</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Stato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRecords.map((record) => {
                  const dateStatus = isOverdueOrDueSoon(record.scheduled_date, record.status);
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.maintenance_type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Plane className="w-4 h-4 mr-1 text-blue-500" />
                          <div>
                            <div>{record.aircraft.tail_number}</div>
                            <div className="text-xs text-gray-500">{record.aircraft.aircraft_type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={record.description}>
                          {record.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <span className={
                            dateStatus === "overdue" ? "text-red-600 font-medium" :
                            dateStatus === "due-soon" ? "text-yellow-600 font-medium" : ""
                          }>
                            {format(parseISO(record.scheduled_date), "dd/MM/yyyy")}
                          </span>
                          {dateStatus === "overdue" && (
                            <AlertTriangle className="w-4 h-4 ml-1 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.technician ? (
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1 text-gray-400" />
                            {record.technician.first_name} {record.technician.last_name}
                          </div>
                        ) : (
                          <span className="text-gray-500">Non assegnato</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CircleDollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          €{record.cost?.toLocaleString() || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusLabel(record.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {maintenanceRecords.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Nessuna manutenzione programmata
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
