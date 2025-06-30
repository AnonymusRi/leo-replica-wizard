
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bug, Server, Database, Wifi, Search, Eye, Trash2, RefreshCw } from "lucide-react";

export const SystemErrors = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const systemErrors = [
    {
      id: 1,
      type: "database",
      severity: "critical",
      message: "Connection timeout to database server",
      organization: "Sky Aviation",
      timestamp: "2024-06-30 14:35:22",
      status: "open",
      affectedUsers: 25,
      details: "Database connection pool exhausted after 30 seconds timeout",
      stackTrace: "SQLException: Connection timeout\n  at DatabasePool.getConnection()\n  at UserService.authenticate()"
    },
    {
      id: 2,
      type: "api",
      severity: "high",
      message: "API rate limit exceeded for user authentication",
      organization: "AlidaSoft Aviation",
      timestamp: "2024-06-30 13:45:12",
      status: "investigating",
      affectedUsers: 1,
      details: "User exceeded 100 requests/minute limit on auth endpoint",
      stackTrace: "RateLimitException: Too many requests\n  at AuthController.login()"
    },
    {
      id: 3,
      type: "network",
      severity: "medium",
      message: "Intermittent connectivity issues with external SMS provider",
      organization: "Multiple",
      timestamp: "2024-06-30 12:20:45",
      status: "resolved",
      affectedUsers: 12,
      details: "SMS OTP delivery delayed by 2-5 minutes",
      stackTrace: "NetworkException: Connection refused\n  at SMSProvider.sendOTP()"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Critico</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800"><Bug className="w-3 h-3 mr-1" />Alto</Badge>;
      case "medium":
        return <Badge variant="secondary"><Server className="w-3 h-3 mr-1" />Medio</Badge>;
      case "low":
        return <Badge variant="outline">Basso</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Aperto</Badge>;
      case "investigating":
        return <Badge className="bg-yellow-100 text-yellow-800">In Analisi</Badge>;
      case "resolved":
        return <Badge variant="default">Risolto</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database":
        return <Database className="w-4 h-4 text-blue-600" />;
      case "api":
        return <Server className="w-4 h-4 text-green-600" />;
      case "network":
        return <Wifi className="w-4 h-4 text-orange-600" />;
      default:
        return <Bug className="w-4 h-4 text-gray-600" />;
    }
  };

  const errorStats = {
    total: systemErrors.length,
    critical: systemErrors.filter(e => e.severity === 'critical').length,
    open: systemErrors.filter(e => e.status === 'open').length,
    affectedUsers: systemErrors.reduce((sum, error) => sum + error.affectedUsers, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Errori di Sistema</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna
          </Button>
          <Button variant="outline">Esporta Log</Button>
        </div>
      </div>

      {/* Statistiche Errori */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errori Totali</p>
                <p className="text-2xl font-bold">{errorStats.total}</p>
              </div>
              <Bug className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errori Critici</p>
                <p className="text-2xl font-bold text-red-600">{errorStats.critical}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errori Aperti</p>
                <p className="text-2xl font-bold text-orange-600">{errorStats.open}</p>
              </div>
              <Server className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utenti Coinvolti</p>
                <p className="text-2xl font-bold text-blue-600">{errorStats.affectedUsers}</p>
              </div>
              <Database className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
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
              <CardTitle>Log Errori di Sistema</CardTitle>
              <CardDescription>
                Monitoraggio in tempo reale degli errori dell'applicazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cerca errori, organizzazioni o messaggi..."
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
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Utenti Coinvolti</TableHead>
                    <TableHead>Timestamp</TableHead>
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
                      <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium truncate">{error.message}</p>
                          <p className="text-xs text-gray-500 truncate">{error.details}</p>
                        </div>
                      </TableCell>
                      <TableCell>{error.organization}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{error.affectedUsers} utenti</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{error.timestamp}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(error.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-3 h-3" />
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

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stato Servizi</CardTitle>
                <CardDescription>
                  Monitoraggio in tempo reale dei servizi principali
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Database Principale</span>
                    </div>
                    <Badge variant="default">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">API Gateway</span>
                    </div>
                    <Badge variant="default">Online</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">SMS Provider</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Lento</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Storage</span>
                    </div>
                    <Badge variant="default">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metriche Performance</CardTitle>
                <CardDescription>
                  Statistiche delle performance dell'ultimo periodo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tempo Risposta API</span>
                    <span className="text-sm">145ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Utilizzo CPU</span>
                    <span className="text-sm">34%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memoria RAM</span>
                    <span className="text-sm">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm text-green-600">99.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Configurazione Alert</CardTitle>
              <CardDescription>
                Imposta le notifiche automatiche per gli errori di sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Soglie di Alert</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Errori Critici</span>
                        <span className="text-sm text-red-600">Immediato</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Errori Alto Livello</span>
                        <span className="text-sm">Entro 5 minuti</span>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">Errori Medio Livello</span>
                        <span className="text-sm">Entro 30 minuti</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Canali di Notifica</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="email-alerts" defaultChecked className="rounded" />
                        <label htmlFor="email-alerts">Email Alert</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="sms-alerts" defaultChecked className="rounded" />
                        <label htmlFor="sms-alerts">SMS Alert</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="slack-alerts" className="rounded" />
                        <label htmlFor="slack-alerts">Slack Integration</label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  Salva Configurazione
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
