
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bug, Server, Database, Wifi, Search, RefreshCw, Eye, Trash2 } from "lucide-react";

export const SystemErrors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const systemErrors = [
    {
      id: 1,
      type: "database",
      severity: "critical",
      message: "Connection timeout to database server",
      timestamp: "2024-06-30 20:45:23",
      affected_users: 12,
      organization: "Sky Aviation",
      status: "investigating",
      details: "Database connection pool exhausted during peak hours"
    },
    {
      id: 2,
      type: "api",
      severity: "high",
      message: "Flight scheduling API returning 500 errors",
      timestamp: "2024-06-30 19:30:15",
      affected_users: 5,
      organization: "AlidaSoft Aviation",
      status: "resolved",
      details: "Temporary server overload resolved with auto-scaling"
    },
    {
      id: 3,
      type: "auth",
      severity: "medium",
      message: "Login attempts failing for specific email domain",
      timestamp: "2024-06-30 18:15:42",
      affected_users: 3,
      organization: "Eurofly",
      status: "monitoring",
      details: "Email provider blocking authentication emails"
    },
    {
      id: 4,
      type: "network",
      severity: "low",
      message: "Slow response times from CDN endpoint",
      timestamp: "2024-06-30 17:20:10",
      affected_users: 25,
      organization: "Multiple",
      status: "resolved",
      details: "CDN cache invalidation resolved performance issues"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critico</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Basso</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "investigating":
        return <Badge className="bg-red-100 text-red-800">In Analisi</Badge>;
      case "monitoring":
        return <Badge className="bg-yellow-100 text-yellow-800">Monitoraggio</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Risolto</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="w-4 h-4" />;
      case "api":
        return <Server className="w-4 h-4" />;
      case "auth":
        return <Bug className="w-4 h-4" />;
      case "network":
        return <Wifi className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const criticalErrors = systemErrors.filter(e => e.severity === "critical").length;
  const activeErrors = systemErrors.filter(e => e.status !== "resolved").length;

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
            <Trash2 className="w-4 h-4 mr-2" />
            Pulisci Risolti
          </Button>
        </div>
      </div>

      {/* Statistiche Errori */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Errori Critici</p>
                <p className="text-2xl font-bold text-red-600">{criticalErrors}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Errori Attivi</p>
                <p className="text-2xl font-bold text-orange-600">{activeErrors}</p>
              </div>
              <Bug className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Errori Oggi</p>
                <p className="text-2xl font-bold text-blue-600">{systemErrors.length}</p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Tempo Medio Risoluzione</p>
                <p className="text-2xl font-bold text-green-600">45min</p>
              </div>
              <RefreshCw className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tutti gli Errori</TabsTrigger>
          <TabsTrigger value="critical">Critici</TabsTrigger>
          <TabsTrigger value="active">Attivi</TabsTrigger>
          <TabsTrigger value="resolved">Risolti</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Log Errori di Sistema</CardTitle>
              <CardDescription>
                Tutti gli errori registrati nel sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca errori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Severità</TableHead>
                    <TableHead>Messaggio</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Utenti Coinvolti</TableHead>
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(error.type)}
                          <span className="capitalize">{error.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSeverityBadge(error.severity)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={error.message}>
                          {error.message}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {error.timestamp}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{error.affected_users} utenti</Badge>
                      </TableCell>
                      <TableCell>{error.organization}</TableCell>
                      <TableCell>
                        {getStatusBadge(error.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical">
          <Card>
            <CardHeader>
              <CardTitle>Errori Critici</CardTitle>
              <CardDescription>
                Errori che richiedono attenzione immediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemErrors.filter(e => e.severity === "critical").map((error) => (
                  <div key={error.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(error.type)}
                          <h4 className="font-semibold text-red-800">{error.message}</h4>
                        </div>
                        <p className="text-sm text-red-600 mb-2">{error.details}</p>
                        <div className="flex items-center space-x-4 text-sm text-red-600">
                          <span>📅 {error.timestamp}</span>
                          <span>👥 {error.affected_users} utenti coinvolti</span>
                          <span>🏢 {error.organization}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(error.status)}
                        <Button variant="outline" size="sm">
                          Risolvi
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Errori Attivi</CardTitle>
              <CardDescription>
                Errori non ancora risolti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Mostra solo errori con stato diverso da "risolto"</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>Errori Risolti</CardTitle>
              <CardDescription>
                Errori che sono stati risolti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Mostra solo errori risolti</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
