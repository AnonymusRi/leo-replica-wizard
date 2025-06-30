
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, CreditCard, CheckCircle, Clock, AlertTriangle, Plus, Eye, Edit } from "lucide-react";

export const OrganizationSetup = () => {
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    licenseType: '',
    maxUsers: '',
    modules: [] as string[]
  });

  const pendingOrganizations = [
    {
      id: 1,
      name: "Meridiana Flight Services",
      email: "admin@meridiana-flight.com",
      phone: "+39 070 123456",
      country: "Italia",
      city: "Cagliari",
      requestDate: "2024-06-28",
      licenseType: "Premium",
      maxUsers: 75,
      status: "pending_review",
      requestedModules: ["SCHED", "SALES", "OPS", "CREW", "MX"],
      notes: "Richiesta licenza per compagnia charter con flotta di 5 aeromobili"
    },
    {
      id: 2,
      name: "Alpine Aviation",
      email: "ops@alpine-aviation.ch",
      phone: "+41 22 987654",
      country: "Svizzera",
      city: "Ginevra",
      requestDate: "2024-06-27",
      licenseType: "Standard",
      maxUsers: 25,
      status: "documents_required",
      requestedModules: ["SCHED", "SALES", "OPS"],
      notes: "Mancano documenti di certificazione AOC"
    },
    {
      id: 3,
      name: "Iberian Executive Jets",
      email: "info@iberian-jets.es",
      phone: "+34 91 555666",
      country: "Spagna",
      city: "Madrid",
      requestDate: "2024-06-26",
      licenseType: "Enterprise",
      maxUsers: 100,
      status: "ready_to_activate",
      requestedModules: ["SCHED", "SALES", "OPS", "CREW", "MX", "REPORTS", "PHONEBOOK"],
      notes: "Documentazione completa, pronto per attivazione"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />In Revisione</Badge>;
      case "documents_required":
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Doc. Richiesti</Badge>;
      case "ready_to_activate":
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Pronta</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const availableModules = [
    { code: "SCHED", name: "Programmazione Voli", essential: true },
    { code: "SALES", name: "Vendite & Preventivi", essential: true },
    { code: "OPS", name: "Operazioni Volo", essential: true },
    { code: "CREW", name: "Gestione Equipaggio", essential: false },
    { code: "MX", name: "Manutenzione", essential: false },
    { code: "REPORTS", name: "Report & Analytics", essential: false },
    { code: "PHONEBOOK", name: "Rubrica Aeroportuale", essential: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Setup Nuove Organizzazioni</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Importa da CSV</Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuova Richiesta
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Richieste Pendenti</TabsTrigger>
          <TabsTrigger value="setup">Setup Manuale</TabsTrigger>
          <TabsTrigger value="templates">Template Licenze</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Organizzazioni in Attesa di Attivazione</CardTitle>
              <CardDescription>
                Gestisci le richieste di nuove licenze ricevute dal sito web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Contatti</TableHead>
                    <TableHead>Licenza Richiesta</TableHead>
                    <TableHead>Moduli</TableHead>
                    <TableHead>Data Richiesta</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrganizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-sm text-gray-500">{org.city}, {org.country}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{org.email}</div>
                          <div className="text-gray-500">{org.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">{org.licenseType}</Badge>
                          <div className="text-xs text-gray-500 mt-1">{org.maxUsers} utenti</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {org.requestedModules.map((module) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{org.requestDate}</TableCell>
                      <TableCell>{getStatusBadge(org.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          {org.status === 'ready_to_activate' && (
                            <Button size="sm">Attiva</Button>
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

        <TabsContent value="setup">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informazioni Organizzazione</CardTitle>
                <CardDescription>
                  Dati principali della nuova organizzazione
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Organizzazione</label>
                    <Input
                      value={newOrgData.name}
                      onChange={(e) => setNewOrgData({...newOrgData, name: e.target.value})}
                      placeholder="Es. AlidaSoft Aviation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Principale</label>
                    <Input
                      type="email"
                      value={newOrgData.email}
                      onChange={(e) => setNewOrgData({...newOrgData, email: e.target.value})}
                      placeholder="admin@azienda.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefono</label>
                    <Input
                      value={newOrgData.phone}
                      onChange={(e) => setNewOrgData({...newOrgData, phone: e.target.value})}
                      placeholder="+39 02 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Paese</label>
                    <Select onValueChange={(value) => setNewOrgData({...newOrgData, country: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona paese" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="italy">Italia</SelectItem>
                        <SelectItem value="switzerland">Svizzera</SelectItem>
                        <SelectItem value="france">Francia</SelectItem>
                        <SelectItem value="spain">Spagna</SelectItem>
                        <SelectItem value="germany">Germania</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Città</label>
                    <Input
                      value={newOrgData.city}
                      onChange={(e) => setNewOrgData({...newOrgData, city: e.target.value})}
                      placeholder="Milano"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Indirizzo</label>
                    <Input
                      value={newOrgData.address}
                      onChange={(e) => setNewOrgData({...newOrgData, address: e.target.value})}
                      placeholder="Via Roma 123"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurazione Licenza</CardTitle>
                <CardDescription>
                  Imposta tipo di licenza e moduli attivi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo Licenza</label>
                    <Select onValueChange={(value) => setNewOrgData({...newOrgData, licenseType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard - €299/mese</SelectItem>
                        <SelectItem value="premium">Premium - €499/mese</SelectItem>
                        <SelectItem value="enterprise">Enterprise - €899/mese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Utenti Massimi</label>
                    <Input
                      type="number"
                      value={newOrgData.maxUsers}
                      onChange={(e) => setNewOrgData({...newOrgData, maxUsers: e.target.value})}
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Moduli Attivi</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableModules.map((module) => (
                      <div key={module.code} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={module.code}
                          className="rounded"
                        />
                        <label htmlFor={module.code} className="text-sm">
                          {module.name}
                          {module.essential && <span className="text-red-500 ml-1">*</span>}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">* Moduli essenziali</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Note Aggiuntive</label>
                  <Textarea
                    placeholder="Note sulla configurazione o richieste speciali..."
                    className="h-20"
                  />
                </div>

                <Button className="w-full">
                  <Building className="w-4 h-4 mr-2" />
                  Crea Organizzazione
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge variant="outline" className="mr-2">Standard</Badge>
                  €299/mese
                </CardTitle>
                <CardDescription>
                  Perfetto per piccole compagnie charter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Fino a 25 utenti</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Moduli inclusi: SCHED, SALES, OPS
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Usa Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge variant="outline" className="mr-2">Premium</Badge>
                  €499/mese
                </CardTitle>
                <CardDescription>
                  Ideale per operatori medi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Fino a 50 utenti</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Moduli inclusi: SCHED, SALES, OPS, CREW, MX
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Usa Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Badge variant="outline" className="mr-2">Enterprise</Badge>
                  €899/mese
                </CardTitle>
                <CardDescription>
                  Per grandi compagnie aeree
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Utenti illimitati</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Tutti i moduli inclusi + supporto prioritario
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Usa Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
