
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Clock, Mail, Phone, RefreshCw } from "lucide-react";

export const ExpiringLicenses = () => {
  const expiringLicenses = [
    {
      id: 1,
      organization: "Air Dolomiti",
      type: "Standard",
      expiresOn: "2024-07-15",
      daysLeft: 10,
      monthlyFee: 299,
      contactEmail: "admin@airdolomiti.com",
      contactPhone: "+39 0471 123456",
      lastContact: "2024-06-25",
      renewalStatus: "pending",
      priority: "high"
    },
    {
      id: 2,
      organization: "Meridiana",
      type: "Premium",
      expiresOn: "2024-07-20",
      daysLeft: 15,
      monthlyFee: 499,
      contactEmail: "it@meridiana.com",
      contactPhone: "+39 070 987654",
      lastContact: "2024-06-20",
      renewalStatus: "contacted",
      priority: "medium"
    },
    {
      id: 3,
      organization: "Eurofly",
      type: "Enterprise",
      expiresOn: "2024-06-30",
      daysLeft: -5,
      monthlyFee: 899,
      contactEmail: "ops@eurofly.com",
      contactPhone: "+39 02 555666",
      lastContact: "2024-06-28",
      renewalStatus: "expired",
      priority: "critical"
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critica</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case "medium":
        return <Badge variant="secondary">Media</Badge>;
      default:
        return <Badge variant="outline">Bassa</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "expired":
        return <Badge variant="destructive">Scaduta</Badge>;
      case "contacted":
        return <Badge className="bg-blue-100 text-blue-800">Contattato</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">In Attesa</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days < 0) return "text-red-600 font-bold";
    if (days <= 7) return "text-red-500 font-semibold";
    if (days <= 30) return "text-orange-500 font-medium";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Licenze in Scadenza</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Invia Promemoria
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Aggiorna Stato
          </Button>
        </div>
      </div>

      {/* Alert Scadenze */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Scadute</p>
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-xs text-red-500">Richiedono azione immediata</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Prossimi 30 giorni</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
                <p className="text-xs text-orange-500">Da contattare presto</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Fatturato a rischio</p>
                <p className="text-2xl font-bold text-blue-600">€1,697</p>
                <p className="text-xs text-blue-500">Fatturato mensile</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabella Scadenze */}
      <Card>
        <CardHeader>
          <CardTitle>Dettaglio Scadenze</CardTitle>
          <CardDescription>
            Licenze che necessitano di rinnovo o sono già scadute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organizzazione</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Giorni Rimasti</TableHead>
                <TableHead>Valore Mensile</TableHead>
                <TableHead>Contatti</TableHead>
                <TableHead>Ultimo Contatto</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Priorità</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expiringLicenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">
                    {license.organization}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{license.type}</Badge>
                  </TableCell>
                  <TableCell>{license.expiresOn}</TableCell>
                  <TableCell>
                    <span className={getDaysLeftColor(license.daysLeft)}>
                      {license.daysLeft < 0 
                        ? `Scaduta da ${Math.abs(license.daysLeft)} giorni`
                        : `${license.daysLeft} giorni`
                      }
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    €{license.monthlyFee}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{license.contactEmail}</div>
                      <div className="text-gray-500">{license.contactPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{license.lastContact}</TableCell>
                  <TableCell>
                    {getStatusBadge(license.renewalStatus)}
                  </TableCell>
                  <TableCell>
                    {getPriorityBadge(license.priority)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm">
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3" />
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

      {/* Azioni Bulk */}
      <Card>
        <CardHeader>
          <CardTitle>Azioni Automatiche</CardTitle>
          <CardDescription>
            Gestisci le comunicazioni automatiche per i rinnovi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Template Email Promemoria</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Primo promemoria (30 giorni)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Secondo promemoria (15 giorni)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Ultimo avviso (7 giorni)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Impostazioni Automatiche</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Configura promemoria automatici
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regole di sospensione
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Notifiche escalation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
