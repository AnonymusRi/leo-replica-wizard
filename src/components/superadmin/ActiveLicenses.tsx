
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Users, Package, TrendingUp, Search, Eye, Edit } from "lucide-react";

export const ActiveLicenses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const activeLicenses = [
    {
      id: 1,
      organization: "AlidaSoft Aviation",
      type: "Premium",
      users: { current: 35, max: 50 },
      modules: 8,
      monthlyRevenue: 499,
      activatedOn: "2024-01-15",
      lastPayment: "2024-06-01",
      nextBilling: "2024-07-01",
      usage: 87
    },
    {
      id: 2,
      organization: "Sky Aviation",
      type: "Standard",
      users: { current: 18, max: 25 },
      modules: 5,
      monthlyRevenue: 299,
      activatedOn: "2024-03-01",
      lastPayment: "2024-06-01",
      nextBilling: "2024-07-01",
      usage: 72
    },
    {
      id: 3,
      organization: "Elite Jets",
      type: "Enterprise",
      users: { current: 95, max: 100 },
      modules: 10,
      monthlyRevenue: 899,
      activatedOn: "2023-11-01",
      lastPayment: "2024-06-01",
      nextBilling: "2024-07-01",
      usage: 95
    }
  ];

  const getUsageBadgeColor = (usage: number) => {
    if (usage >= 90) return "bg-red-100 text-red-800";
    if (usage >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const totalRevenue = activeLicenses.reduce((sum, license) => sum + license.monthlyRevenue, 0);
  const totalUsers = activeLicenses.reduce((sum, license) => sum + license.users.current, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Licenze Attive</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Esporta Report</Button>
          <Button>Rinnova Tutte</Button>
        </div>
      </div>

      {/* Statistiche Generali */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Licenze Attive</p>
                <p className="text-2xl font-bold text-green-600">{activeLicenses.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utenti Totali</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatturato Mensile</p>
                <p className="text-2xl font-bold text-purple-600">€{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Moduli Totali</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <Package className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabella Licenze */}
      <Card>
        <CardHeader>
          <CardTitle>Dettaglio Licenze Attive</CardTitle>
          <CardDescription>
            Monitoraggio utilizzo e fatturazione delle licenze attive
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organizzazione</TableHead>
                <TableHead>Tipo Licenza</TableHead>
                <TableHead>Utilizzo Utenti</TableHead>
                <TableHead>Moduli</TableHead>
                <TableHead>Fatturato Mensile</TableHead>
                <TableHead>Prossima Fatturazione</TableHead>
                <TableHead>Utilizzo</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLicenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">
                    {license.organization}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{license.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{license.users.current}/{license.users.max}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(license.users.current / license.users.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{license.modules} moduli</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    €{license.monthlyRevenue}
                  </TableCell>
                  <TableCell>{license.nextBilling}</TableCell>
                  <TableCell>
                    <Badge className={getUsageBadgeColor(license.usage)}>
                      {license.usage}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-3 h-3" />
                      </Button>
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
