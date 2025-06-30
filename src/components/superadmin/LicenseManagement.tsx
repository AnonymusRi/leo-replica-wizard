
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Eye, AlertTriangle } from "lucide-react";

export const LicenseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const licenses = [
    {
      id: 1,
      organization: "AlidaSoft Aviation",
      type: "Premium",
      users: 50,
      modules: ["SCHED", "SALES", "OPS", "CREW", "MX"],
      status: "active",
      expires: "2024-12-31",
      monthlyFee: 499
    },
    {
      id: 2,
      organization: "Sky Aviation",
      type: "Standard",
      users: 25,
      modules: ["SCHED", "SALES", "OPS"],
      status: "active",
      expires: "2024-10-15",
      monthlyFee: 299
    },
    {
      id: 3,
      organization: "Eurofly",
      type: "Premium",
      users: 75,
      modules: ["SCHED", "SALES", "OPS", "CREW", "MX", "REPORTS"],
      status: "expired",
      expires: "2024-06-25",
      monthlyFee: 699
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Attiva</Badge>;
      case "expired":
        return <Badge variant="destructive">Scaduta</Badge>;
      case "suspended":
        return <Badge variant="secondary">Sospesa</Badge>;
      default:
        return <Badge variant="outline">Sconosciuto</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestione Licenze</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuova Licenza
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Licenze Sistema</CardTitle>
          <CardDescription>
            Gestisci tutte le licenze attive, scadute e in sospensione
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cerca organizzazione o tipo licenza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organizzazione</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Utenti</TableHead>
                <TableHead>Moduli</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Scadenza</TableHead>
                <TableHead>Canone Mensile</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-medium">
                    {license.organization}
                  </TableCell>
                  <TableCell>{license.type}</TableCell>
                  <TableCell>{license.users}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {license.modules.map((module) => (
                        <Badge key={module} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(license.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {license.status === 'expired' && (
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      {license.expires}
                    </div>
                  </TableCell>
                  <TableCell>€{license.monthlyFee}</TableCell>
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
