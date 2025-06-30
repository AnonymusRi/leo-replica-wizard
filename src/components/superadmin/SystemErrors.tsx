
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, AlertTriangle, Info, CheckCircle, Search, Filter, RefreshCw } from "lucide-react";

export const SystemErrors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

  const errors = [
    {
      id: 1,
      timestamp: "2024-06-30 14:30:25",
      level: "error",
      module: "CREW",
      organization: "AlidaSoft Aviation",
      message: "Errore validazione certificato pilota",
      details: "Certificato scaduto per pilota ID: 123",
      status: "open",
      assignedTo: "Support Team"
    },
    {
      id: 2,
      timestamp: "2024-06-30 13:15:10",
      level: "warning",
      module: "SCHED",
      organization: "Sky Aviation",
      message: "Sovrapposizione orari aeromobile",
      details: "Aeromobile I-ABCD schedulato su due voli simultanei",
      status: "investigating",
      assignedTo: "Dev Team"
    },
    {
      id: 3,
      timestamp: "2024-06-30 12:45:30",
      level: "info",
      module: "BILLING",
      organization: "Elite Jets",
      message: "Pagamento ricevuto",
      details: "Fattura INV-2024-001 pagata correttamente",
      status: "resolved",
      assignedTo: null
    },
    {
      id: 4,
      timestamp: "2024-06-30 11:20:15",
      level: "error",
      module: "MX",
      organization: "Eurofly",
      message: "Errore sincronizzazione manutenzione",
      details: "Impossibile aggiornare record manutenzione",
      status: "open",
      assignedTo: "Tech Support"
    }
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Errore</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case "info":
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Aperto</Badge>;
      case "investigating":
        return <Badge className="bg-orange-100 text-orange-800">In Analisi</Badge>;
      case "resolved":
        return <Badge variant="default">Risolto</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const errorStats = {
    total: errors.length,
    errors: errors.filter(e => e.level === "error").length,
    warnings: errors.filter(e => e.level === "warning").length,
    open: errors.filter(e => e.status === "open").length
  };

  const filteredErrors = errors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === "all" || error.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Errori Sistema</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          <Button>
            <AlertCircle className="w-4 h-4 mr-2" />
            Nuova Segnalazione
          </Button>
        </div>
      </div>

      {/* Statistiche Errori */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totale Segnalazioni</p>
                <p className="text-2xl font-bold text-blue-600">{errorStats.total}</p>
              </div>
              <Info className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errori Critici</p>
                <p className="text-2xl font-bold text-red-600">{errorStats.errors}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">{errorStats.warnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Da Risolvere</p>
                <p className="text-2xl font-bold text-orange-600">{errorStats.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtri e Ricerca */}
      <Card>
        <CardHeader>
          <CardTitle>Log Sistema</CardTitle>
          <CardDescription>
            Tutti gli errori, warning e notifiche del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cerca errori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Livello" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti i livelli</SelectItem>
                <SelectItem value="error">Solo Errori</SelectItem>
                <SelectItem value="warning">Solo Warning</SelectItem>
                <SelectItem value="info">Solo Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Livello</TableHead>
                <TableHead>Modulo</TableHead>
                <TableHead>Organizzazione</TableHead>
                <TableHead>Messaggio</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Assegnato a</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell className="font-mono text-sm">
                    {error.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getLevelIcon(error.level)}
                      {getLevelBadge(error.level)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{error.module}</Badge>
                  </TableCell>
                  <TableCell>{error.organization}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{error.message}</p>
                      <p className="text-sm text-gray-500">{error.details}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(error.status)}
                  </TableCell>
                  <TableCell>
                    {error.assignedTo ? (
                      <Badge variant="secondary">{error.assignedTo}</Badge>
                    ) : (
                      <span className="text-gray-400">Non assegnato</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Dettagli
                      </Button>
                      {error.status === "open" && (
                        <Button size="sm">
                          Risolvi
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
