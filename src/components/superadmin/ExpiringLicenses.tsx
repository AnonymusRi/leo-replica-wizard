
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Calendar, Mail, Phone, Clock, RefreshCw, Search } from "lucide-react";

export const ExpiringLicenses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const expiringLicenses = [
    {
      id: 1,
      organization: "Eurofly",
      type: "Premium",
      users: 75,
      expiresIn: 5,
      expiryDate: "2024-07-05",
      contactPerson: "Marco Bianchi",
      email: "m.bianchi@eurofly.com",
      phone: "+39 02 1234567",
      monthlyFee: 699,
      lastContact: "2024-06-20",
      renewalStatus: "not_contacted"
    },
    {
      id: 2,
      organization: "Air Dolomiti",
      type: "Standard",
      users: 30,
      expiresIn: 15,
      expiryDate: "2024-07-15",
      contactPerson: "Anna Rossi",
      email: "a.rossi@airdolomiti.com",
      phone: "+39 0471 123456",
      monthlyFee: 399,
      lastContact: "2024-06-25",
      renewalStatus: "contacted"
    },
    {
      id: 3,
      organization: "Meridiana",
      type: "Enterprise",
      users: 120,
      expiresIn: 30,
      expiryDate: "2024-07-30",
      contactPerson: "Giuseppe Carta",
      email: "g.carta@meridiana.com",
      phone: "+39 070 987654",
      monthlyFee: 999,
      lastContact: "2024-06-28",
      renewalStatus: "renewal_sent"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_contacted":
        return <Badge variant="destructive">Non Contattato</Badge>;
      case "contacted":
        return <Badge className="bg-yellow-100 text-yellow-800">Contattato</Badge>;
      case "renewal_sent":
        return <Badge className="bg-blue-100 text-blue-800">Rinnovo Inviato</Badge>;
      case "renewed":
        return <Badge variant="default">Rinnovato</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return "border-red-200 bg-red-50";
    if (days <= 15) return "border-orange-200 bg-orange-50";
    return "border-yellow-200 bg-yellow-50";
  };

  const criticalExpiring = expiringLicenses.filter(l => l.expiresIn <= 7).length;
  const totalRevenue = expiringLicenses.reduce((sum, license) => sum + license.monthlyFee, 0);

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
            Rinnova Automatico
          </Button>
        </div>
      </div>

      {/* Statistiche Scadenze */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Scadono Questa Settimana</p>
                <p className="text-2xl font-bold text-red-600">{criticalExpiring}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Scadono Questo Mese</p>
                <p className="text-2xl font-bold text-orange-600">{expiringLicenses.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Fatturato a Rischio</p>
                <p className="text-2xl font-bold text-purple-600">€{totalRevenue.toLocaleString()}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Tasso Rinnovo</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
              <RefreshCw className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista Licenze in Scadenza */}
      <Card>
        <CardHeader>
          <CardTitle>Licenze che Scadono Presto</CardTitle>
          <CardDescription>
            Monitora e gestisci i rinnovi delle licenze in scadenza
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cerca organizzazione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="space-y-4">
            {expiringLicenses.map((license) => (
              <Card key={license.id} className={getUrgencyColor(license.expiresIn)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-semibold text-lg">{license.organization}</h4>
                        <Badge variant="outline">{license.type}</Badge>
                        {getStatusBadge(license.renewalStatus)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Scade in:</span>
                          <div className="font-medium">{license.expiresIn} giorni</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Data scadenza:</span>
                          <div className="font-medium">{license.expiryDate}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Utenti:</span>
                          <div className="font-medium">{license.users}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Fatturato mensile:</span>
                          <div className="font-medium">€{license.monthlyFee}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="mr-1">👤</span>
                          {license.contactPerson}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {license.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {license.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-3 h-3 mr-1" />
                        Contatta
                      </Button>
                      <Button variant="default" size="sm">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Rinnova
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
