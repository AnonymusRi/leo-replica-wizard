
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  Building,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle
} from "lucide-react";
import { useTrainingRecords, useDeleteTrainingRecord } from "@/hooks/useTrainingRecords";
import { useCrewMembers } from "@/hooks/useCrewMembers";
import { TrainingModal } from "./TrainingModal";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { it } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const TrainingModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPilot, setSelectedPilot] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const { data: trainingRecords = [], isLoading: recordsLoading } = useTrainingRecords();
  const { data: crewMembers = [], isLoading: crewLoading } = useCrewMembers();
  const deleteMutation = useDeleteTrainingRecord();

  const pilots = crewMembers.filter(member => 
    member.position === "captain" || member.position === "first_officer"
  );

  const filteredRecords = trainingRecords.filter(record => {
    const pilot = pilots.find(p => p.id === record.pilot_id);
    const pilotName = pilot ? `${pilot.first_name} ${pilot.last_name}` : '';
    
    const matchesSearch = pilotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.training_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.training_organization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPilot = selectedPilot === "all" || record.pilot_id === selectedPilot;
    const matchesType = selectedType === "all" || record.training_type === selectedType;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
    
    return matchesSearch && matchesPilot && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return "bg-green-500 text-white";
      case 'in_progress': return "bg-blue-500 text-white";
      case 'scheduled': return "bg-yellow-500 text-black";
      case 'cancelled': return "bg-red-500 text-white";
      default: return "bg-gray-400 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4" />;
      case 'scheduled': return <Calendar className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      'simulator': 'Simulatore',
      'aircraft': 'Aeromobile',
      'ground_school': 'Scuola a Terra',
      'recurrent': 'Ricorrente',
      'type_rating': 'Abilitazione al Tipo',
      'proficiency_check': 'Controllo di Competenza'
    };
    return types[type as keyof typeof types] || type;
  };

  const isExpiringS oon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return isAfter(expiry, new Date()) && isBefore(expiry, thirtyDaysFromNow);
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return isBefore(new Date(expiryDate), new Date());
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo record di addestramento?')) {
      deleteMutation.mutate(id);
    }
  };

  if (crewLoading || recordsLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <GraduationCap className="w-6 h-6 mr-2" />
            Gestione Addestramento
          </h1>
          <p className="text-gray-600">Tracciamento addestramenti e impatto sui limiti FTL</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedRecord(null);
            setModalMode('create');
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Addestramento
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca per pilota o descrizione..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedPilot} onValueChange={setSelectedPilot}>
              <SelectTrigger>
                <SelectValue placeholder="Filtra per pilota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i piloti</SelectItem>
                {pilots.map((pilot) => (
                  <SelectItem key={pilot.id} value={pilot.id}>
                    {pilot.first_name} {pilot.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo addestramento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i tipi</SelectItem>
                <SelectItem value="simulator">Simulatore</SelectItem>
                <SelectItem value="aircraft">Aeromobile</SelectItem>
                <SelectItem value="ground_school">Scuola a Terra</SelectItem>
                <SelectItem value="recurrent">Ricorrente</SelectItem>
                <SelectItem value="type_rating">Abilitazione al Tipo</SelectItem>
                <SelectItem value="proficiency_check">Controllo di Competenza</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="scheduled">Programmato</SelectItem>
                <SelectItem value="in_progress">In Corso</SelectItem>
                <SelectItem value="completed">Completato</SelectItem>
                <SelectItem value="cancelled">Annullato</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtri Avanzati
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Training Records */}
      <div className="grid gap-4">
        {filteredRecords.map((record) => {
          const pilot = pilots.find(p => p.id === record.pilot_id);
          const expiringS oon = isExpiringS oon(record.expiry_date);
          const expired = isExpired(record.expiry_date);
          
          return (
            <Card key={record.id} className={`${expired ? 'border-red-200 bg-red-50' : expiringS oon ? 'border-yellow-200 bg-yellow-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {pilot ? `${pilot.first_name} ${pilot.last_name}` : 'Pilota non trovato'}
                        </span>
                      </div>
                      
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">
                          {record.status === 'completed' ? 'Completato' :
                           record.status === 'in_progress' ? 'In Corso' :
                           record.status === 'scheduled' ? 'Programmato' : 'Annullato'}
                        </span>
                      </Badge>

                      <Badge variant="outline">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {getTypeLabel(record.training_type)}
                      </Badge>

                      {record.ftl_applicable && (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          FTL
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-medium text-lg mb-2">{record.training_description}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(record.training_date), "dd MMM yyyy", { locale: it })}
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {record.duration_hours}h
                      </div>
                      
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {record.training_organization}
                      </div>
                      
                      {record.certification_achieved && (
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          {record.certification_achieved}
                        </div>
                      )}
                    </div>

                    {record.expiry_date && (
                      <div className={`mt-2 text-sm flex items-center ${expired ? 'text-red-600' : expiringS oon ? 'text-yellow-600' : 'text-gray-600'}`}>
                        {expired || expiringS oon ? (
                          <AlertTriangle className="w-4 h-4 mr-2" />
                        ) : (
                          <Calendar className="w-4 h-4 mr-2" />
                        )}
                        Scadenza: {format(new Date(record.expiry_date), "dd MMM yyyy", { locale: it })}
                        {expired && <span className="ml-2 font-medium">(SCADUTO)</span>}
                        {expiringS oon && <span className="ml-2 font-medium">(IN SCADENZA)</span>}
                      </div>
                    )}

                    <div className="mt-3 flex items-center space-x-4 text-xs">
                      {record.counts_as_duty_time && (
                        <Badge variant="outline" className="text-blue-600">
                          Duty Time
                        </Badge>
                      )}
                      {record.counts_as_flight_time && (
                        <Badge variant="outline" className="text-green-600">
                          Flight Time
                        </Badge>
                      )}
                    </div>

                    {record.notes && (
                      <p className="mt-2 text-sm text-gray-600 italic">{record.notes}</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        •••
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(record)}>
                        Modifica
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600"
                      >
                        Elimina
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredRecords.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Nessun addestramento trovato</h3>
              <p className="text-gray-500 mb-4">
                Non ci sono addestramenti che corrispondono ai filtri selezionati
              </p>
              <Button onClick={() => {
                setSelectedRecord(null);
                setModalMode('create');
                setIsModalOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Crea il primo addestramento
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <TrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pilots={pilots}
        existingRecord={selectedRecord}
        mode={modalMode}
      />
    </div>
  );
};
