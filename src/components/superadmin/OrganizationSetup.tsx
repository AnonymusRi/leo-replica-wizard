
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Plus, Mail, Phone, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const OrganizationSetup = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const pendingOrganizations = [
    {
      id: 1,
      name: "Mediterranean Airlines",
      contactPerson: "Marco Rossi",
      email: "marco.rossi@medair.com",
      phone: "+39 06 1234567",
      requestDate: "2024-06-28",
      licenseType: "Premium",
      estimatedUsers: 35,
      status: "pending_review"
    },
    {
      id: 2,
      name: "Alpine Helicopters",
      contactPerson: "Anna Bianchi",
      email: "a.bianchi@alpinehelis.com",
      phone: "+39 011 987654",
      requestDate: "2024-06-27",
      licenseType: "Standard",
      estimatedUsers: 15,
      status: "documentation_required"
    },
    {
      id: 3,
      name: "Sardinia Charter",
      contactPerson: "Giuseppe Carta",
      email: "g.carta@sardiniacharter.it",
      phone: "+39 070 456789",
      requestDate: "2024-06-26",
      licenseType: "Enterprise",
      estimatedUsers: 50,
      status: "ready_for_setup"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge className="bg-yellow-100 text-yellow-800">In Revisione</Badge>;
      case "documentation_required":
        return <Badge className="bg-orange-100 text-orange-800">Documentazione Richiesta</Badge>;
      case "ready_for_setup":
        return <Badge className="bg-green-100 text-green-800">Pronto per Setup</Badge>;
      case "setup_complete":
        return <Badge variant="default">Setup Completato</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nuove Organizzazioni</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuova Richiesta
        </Button>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Richieste Pendenti</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pronte per Setup</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documentazione Richiesta</p>
                <p className="text-2xl font-bold text-orange-600">1</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Setup Questa Settimana</p>
                <p className="text-2xl font-bold text-purple-600">2</p>
              </div>
              <Building className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Richieste Pendenti</TabsTrigger>
          <TabsTrigger value="setup">Setup in Corso</TabsTrigger>
          <TabsTrigger value="completed">Completati</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Richieste di Nuove Organizzazioni</CardTitle>
              <CardDescription>
                Gestisci le richieste di setup per nuove organizzazioni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Contatto</TableHead>
                    <TableHead>Data Richiesta</TableHead>
                    <TableHead>Tipo Licenza</TableHead>
                    <TableHead>Utenti Stimati</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">
                        {org.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{org.contactPerson}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {org.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {org.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{org.requestDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{org.licenseType}</Badge>
                      </TableCell>
                      <TableCell>{org.estimatedUsers}</TableCell>
                      <TableCell>
                        {getStatusBadge(org.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Revisiona
                          </Button>
                          <Button variant="default" size="sm">
                            Approva
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

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Setup in Corso</CardTitle>
              <CardDescription>
                Organizzazioni attualmente in fase di setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Nessun setup in corso al momento</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Setup Completati</CardTitle>
              <CardDescription>
                Organizzazioni con setup completato di recente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Nessun setup completato di recente</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
