
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, User, Plane, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const AccessCredentials = () => {
  const [showPasswords, setShowPasswords] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiato negli appunti`);
  };

  const managerAccounts = [
    {
      name: "Mario Rossi",
      email: "mario.rossi@alidasoft.com",
      role: "Admin",
      password: "Admin123!",
      permissions: ["Tutti i moduli", "Gestione utenti", "Configurazione sistema"],
      description: "Accesso completo alla piattaforma con privilegi amministrativi"
    },
    {
      name: "Giulia Bianchi",
      email: "giulia.bianchi@alidasoft.com",
      role: "Operator",
      password: "Operator123!",
      permissions: ["Scheduling", "Operations", "Aircraft", "Crew", "Maintenance"],
      description: "Accesso operativo per gestione quotidiana delle operazioni"
    },
    {
      name: "Marco Verdi",
      email: "marco.verdi@alidasoft.com",
      role: "Viewer",
      password: "Viewer123!",
      permissions: ["Scheduling", "Operations", "Crew", "Reports"],
      description: "Accesso in sola lettura per monitoraggio e reporting"
    }
  ];

  const pilotAccounts = [
    {
      name: "Alessandro Conti",
      email: "alessandro.conti@pilot.com",
      position: "Comandante",
      license: "ATPL-IT-12345",
      password: "Pilot123!",
      aircraft: "A320",
      base: "LIRF",
      description: "Comandante senior con accesso completo alla dashboard piloti"
    },
    {
      name: "Francesca Marino",
      email: "francesca.marino@pilot.com",
      position: "Primo Ufficiale",
      license: "CPL-IT-67890",
      password: "Pilot123!",
      aircraft: "B737",
      base: "LIRF",
      description: "Primo ufficiale specializzata in voli charter"
    },
    {
      name: "Roberto Ferrari",
      email: "roberto.ferrari@pilot.com",
      position: "Comandante",
      license: "ATPL-IT-11111",
      password: "Pilot123!",
      aircraft: "A321",
      base: "LINATE",
      description: "Comandante con esperienza internazionale"
    },
    {
      name: "Laura Costa",
      email: "laura.costa@pilot.com",
      position: "Primo Ufficiale",
      license: "CPL-IT-22222",
      password: "Pilot123!",
      aircraft: "E195",
      base: "LINATE",
      description: "Primo ufficiale con specializzazione meteorologia"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Credenziali di Accesso - Demo</h1>
        <Button
          variant="outline"
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center space-x-2"
        >
          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPasswords ? 'Nascondi' : 'Mostra'} Password</span>
        </Button>
      </div>

      {/* Manager Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Account Gestori Licenza</span>
          </CardTitle>
          <CardDescription>
            Credenziali per accedere alla piattaforma di gestione con diversi livelli di autorizzazione
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {managerAccounts.map((account, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <Badge variant={
                      account.role === 'Admin' ? 'destructive' : 
                      account.role === 'Operator' ? 'default' : 'secondary'
                    }>
                      {account.role}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {account.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email:</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {account.email}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(account.email, "Email")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Password:</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {showPasswords ? account.password : '••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(account.password, "Password")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Permessi:</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {account.permissions.slice(0, 3).map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {account.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{account.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    Accedi come {account.name.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pilot Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>Account Piloti</span>
          </CardTitle>
          <CardDescription>
            Credenziali per accedere alla dashboard dedicata ai membri dell'equipaggio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pilotAccounts.map((pilot, index) => (
              <Card key={index} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pilot.name}</CardTitle>
                    <Badge variant={pilot.position === 'Comandante' ? 'default' : 'secondary'}>
                      {pilot.position}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {pilot.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Licenza:</span>
                      <div className="text-xs bg-blue-50 px-2 py-1 rounded mt-1">
                        {pilot.license}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Base:</span>
                      <div className="text-xs bg-green-50 px-2 py-1 rounded mt-1">
                        {pilot.base}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Email:</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {pilot.email}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pilot.email, "Email")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Password:</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                        {showPasswords ? pilot.password : '••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(pilot.password, "Password")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Badge variant="outline" className="text-xs">
                      {pilot.aircraft}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ATL Compliant
                    </Badge>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <Plane className="w-4 h-4 mr-2" />
                    Dashboard Pilota
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Istruzioni per l'Accesso</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="space-y-2">
            <p><strong>Account Gestori:</strong> Utilizzare le credenziali sopra per accedere alla piattaforma principale con diversi livelli di autorizzazione.</p>
            <p><strong>Account Piloti:</strong> I piloti possono accedere alla dashboard dedicata per visualizzare i propri programmi, certificazioni e messaggi.</p>
            <p><strong>Funzionalità ATL:</strong> Ogni pilota ha accesso al proprio profilo personale con gestione delle certificazioni, ore di volo e compliance FTL.</p>
            <p className="text-sm italic">Tutti gli account sono preconfigurati con dati realistici per la dimostrazione.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
