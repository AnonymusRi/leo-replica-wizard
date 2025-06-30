
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Building, Mail, Phone, MapPin, CreditCard } from "lucide-react";

export const OrganizationSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    licenseType: "",
    maxUsers: "",
    modules: [] as string[],
    billingEmail: "",
    vatNumber: "",
    notes: ""
  });

  const availableModules = [
    { id: "SCHED", label: "Schedulazione", description: "Gestione voli e programmazione" },
    { id: "SALES", label: "Vendite", description: "Preventivi e clienti" },
    { id: "OPS", label: "Operazioni", description: "Gestione operativa voli" },
    { id: "AIRCRAFT", label: "Aeromobili", description: "Gestione flotta" },
    { id: "CREW", label: "Equipaggio", description: "Gestione personale di volo" },
    { id: "CREW-TIME", label: "Ore Equipaggio", description: "Tracciamento tempi di volo" },
    { id: "MX", label: "Manutenzione", description: "Manutenzione aeromobili" },
    { id: "REPORTS", label: "Report", description: "Reportistica avanzata" },
    { id: "PHONEBOOK", label: "Rubrica", description: "Contatti e directory" },
    { id: "OWNER BOARD", label: "Owner Board", description: "Dashboard proprietari" }
  ];

  const handleModuleToggle = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(m => m !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Setup Nuova Organizzazione</h1>
        <Button variant="outline">
          Importa da CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dati Azienda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Dati Azienda
            </CardTitle>
            <CardDescription>
              Informazioni di base dell'organizzazione
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Organizzazione</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="es. Alitalia Express"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@company.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+39 02 1234567"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Via Roma 123"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Città</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Milano"
                />
              </div>
              <div>
                <Label htmlFor="country">Paese</Label>
                <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona paese" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">Italia</SelectItem>
                    <SelectItem value="FR">Francia</SelectItem>
                    <SelectItem value="DE">Germania</SelectItem>
                    <SelectItem value="ES">Spagna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurazione Licenza */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Configurazione Licenza
            </CardTitle>
            <CardDescription>
              Tipo di licenza e moduli inclusi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="licenseType">Tipo Licenza</Label>
              <Select value={formData.licenseType} onValueChange={(value) => setFormData(prev => ({ ...prev, licenseType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial (30 giorni)</SelectItem>
                  <SelectItem value="standard">Standard (€299/mese)</SelectItem>
                  <SelectItem value="premium">Premium (€499/mese)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (€899/mese)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxUsers">Numero Massimo Utenti</Label>
              <Input
                id="maxUsers"
                type="number"
                value={formData.maxUsers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: e.target.value }))}
                placeholder="50"
              />
            </div>

            <div>
              <Label>Moduli Inclusi</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {availableModules.map((module) => (
                  <div key={module.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={module.id}
                      checked={formData.modules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={module.id} className="text-sm font-medium">
                        {module.label}
                      </Label>
                      <p className="text-xs text-gray-600">{module.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dati Fatturazione */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Dati Fatturazione
            </CardTitle>
            <CardDescription>
              Informazioni per la fatturazione
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="billingEmail">Email Fatturazione</Label>
              <Input
                id="billingEmail"
                type="email"
                value={formData.billingEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, billingEmail: e.target.value }))}
                placeholder="accounting@company.com"
              />
            </div>

            <div>
              <Label htmlFor="vatNumber">Partita IVA</Label>
              <Input
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vatNumber: e.target.value }))}
                placeholder="IT12345678901"
              />
            </div>

            <div>
              <Label htmlFor="notes">Note</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Note aggiuntive o requisiti speciali..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Riepilogo */}
        <Card>
          <CardHeader>
            <CardTitle>Riepilogo Setup</CardTitle>
            <CardDescription>
              Verifica i dati prima di creare l'organizzazione
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Cosa succederà:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Creazione organizzazione nel database</li>
                <li>• Attivazione licenza {formData.licenseType}</li>
                <li>• Abilitazione moduli selezionati</li>
                <li>• Invio email di benvenuto</li>
                <li>• Creazione utente amministratore</li>
              </ul>
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">
                Crea Organizzazione
              </Button>
              <Button variant="outline">
                Salva Bozza
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
