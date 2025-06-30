
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Clock, XCircle, Search, Filter, RefreshCw, Eye, Settings } from "lucide-react";

export const SystemErrors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const systemErrors = [
    {
      id: 1,
      timestamp: "2024-06-30 14:32:15",
      severity: "critical",
      component: "Database Connection",
      error_code: "DB_CONN_001",
      message: "Connection timeout to primary database",
      affected_users: 45,
      status: "investigating",
      resolution_time: null,
      organization: "Sky Aviation"
    },
    {
      id: 2,
      timestamp: "2024-06-30 13:15:42",
      severity: "warning",
      component: "SMS Service",
      error_code: "SMS_001",
      message: "OTP delivery delayed for +393933374430",
      affected_users: 1,
      status: "resolved",
      resolution_time: "5 min",
      organization: "SuperAdmin"
    },
    {
      id: 3,
      timestamp: "2024-06-30 12:48:30",
      severity: "error",
      component: "License Validation",
      error_code: "LIC_VAL_003",
      message: "Expired license detected for organization",
      affected_users: 12,
      status: "pending",
      resolution_time: null,
      organization: "Meridiana Flight"
    },
    {
      id: 4,
      timestamp: "2024-06-30 11:22:18",
      severity: "info",
      component: "Backup System",
      error_code: "BACKUP_INFO_001",
      message: "Daily backup completed successfully",
      affected_users: 0,
      status: "resolved",
      resolution_time: "N/A",
      organization: "System"
    },
    {
      id: 5,
      timestamp: "2024-06-30 10:15:33",
      severity: "warning",
      component: "API Rate Limit",
      error_code: "API_RATE_002",
      message: "Rate limit exceeded for external API calls",
      affected_users: 8,
      status: "monitoring",
      resolution_time: null,
      organization: "Alpine Aviation"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Critico</Badge>;
      case "error":
        return <Badge variant="destructive" className="bg-orange-600"><AlertTriangle className="w-3 h-3 mr-1" />Errore</Badge>;
      case "warning":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Warning</Badge>;
      case "info":
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Info</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Risolto</Badge>;
      case "investigating":
        return <Badge variant="outline" className="border-blue-500 text-blue-700"><Search className="w-3 h-3 mr-1" />Investigando</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />In Attesa</Badge>;
      case "monitoring":
        return <Badge variant="outline" className="border-purple-500 text-purple-700"><Eye className="w-3 h-3 mr-1" />Monitoraggio</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const filteredErrors = systemErrors.filter(error => {
    const matchesSearch = error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || error.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || error.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Errori di Sistema</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurazioni
          </Button>
        </div>
      </div>

      <Tabs defaultValue="errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="errors">Log Errori</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoraggio</TabsTrigger>
          <TabsTrigger value="alerts">Configurazione Alert</TabsTrigger>
        </TabsList>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Sistema di Monitoraggio Errori</CardTitle>
              <CardDescription>
                Visualizza e gestisci tutti gli errori di sistema in tempo reale
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtri */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Cerca errori, componenti, organizzazioni..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severità" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le Severità</SelectItem>
                    <SelectItem value="critical">Critico</SelectItem>
                    <SelectItem value="error">Errore</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti gli Status</SelectItem>
                    <SelectItem value="resolved">Risolto</SelectItem>
                    <SelectItem value="investigating">Investigando</SelectItem>
                    <SelectItem value="pending">In Attesa</SelectItem>
                    <SelectItem value="monitoring">Monitoraggio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabella Errori */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Severità</TableHead>
                    <TableHead>Componente</TableHead>
                    <TableHead>Errore</TableHead>
                    <TableHead>Utenti Coinvolti</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tempo Risoluzione</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell className="font-mono text-xs">
                        {error.timestamp}
                      </TableCell>
                      <TableCell>
                        {getSeverityBadge(error.severity)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{error.component}</div>
                          <div className="text-xs text-gray-500">{error.error_code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{error.message}</div>
                          <div className="text-xs text-gray-500">{error.organization}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {error.affected_users} utenti
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(error.status)}
                      </TableCell>
                      <TableCell>
                        {error.resolution_time ? (
                          <span className="text-green-600 font-medium">
                            {error.resolution_time}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          {error.status !== 'resolved' && (
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
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Errori Critici</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">1</div>
                <p className="text-sm text-gray-600">Ultima ora</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Warning Attivi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">2</div>
                <p className="text-sm text-gray-600">In monitoraggio</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Uptime Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">99.8%</div>
                <p className="text-sm text-gray-600">Ultimi 30 giorni</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tempo Risp. Medio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">245ms</div>
                <p className="text-sm text-gray-600">Ultima ora</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Configurazione Alert</CardTitle>
              <CardDescription>
                Imposta regole di notifica per gli errori di sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Alert Email SuperAdmin</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Invia email a riccardo.cirulli@gmail.com per errori critici
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Attivo</Badge>
                    <Button variant="outline" size="sm">Configura</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Alert SMS</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Invia SMS al +393933374430 per errori critici
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Attivo</Badge>
                    <Button variant="outline" size="sm">Configura</Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Slack Integration</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Notifiche su canale Slack #system-alerts
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Non Configurato</Badge>
                    <Button variant="outline" size="sm">Configura</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
