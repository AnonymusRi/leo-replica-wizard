
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, AlertTriangle, TrendingUp, Search, Download, RefreshCw } from "lucide-react";
import { useSaasLicenses, useExpiredLicenses, useExpiringLicenses } from "@/hooks/useSaasLicenses";
import { toast } from "sonner";

export const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: licenses = [] } = useSaasLicenses();
  const { data: expiredLicenses = [] } = useExpiredLicenses();
  const { data: expiringLicenses = [] } = useExpiringLicenses();

  const handleRenewLicense = (licenseId: string) => {
    toast.success(`Rinnovo licenza ${licenseId} avviato`);
    console.log("Rinnovo licenza:", licenseId);
  };

  const handleSuspendLicense = (licenseId: string) => {
    toast.warning(`Licenza ${licenseId} sospesa`);
    console.log("Sospensione licenza:", licenseId);
  };

  const handleExportPayments = () => {
    toast.success("Export pagamenti avviato");
    console.log("Export report pagamenti");
  };

  const totalRevenue = licenses.reduce((sum: number, license: any) => sum + (license.monthly_fee || 0), 0);
  const activeSubscriptions = licenses.filter((license: any) => license.is_active).length;

  const getStatusBadge = (license: any) => {
    if (!license.is_active) return <Badge variant="secondary">Inattiva</Badge>;
    if (expiredLicenses.some((expired: any) => expired.id === license.id)) {
      return <Badge variant="destructive">Scaduta</Badge>;
    }
    if (expiringLicenses.some((expiring: any) => expiring.id === license.id)) {
      return <Badge className="bg-yellow-100 text-yellow-800">In Scadenza</Badge>;
    }
    return <Badge variant="default">Attiva</Badge>;
  };

  const getLicenseTypeBadge = (type: string) => {
    switch (type) {
      case "trial":
        return <Badge variant="outline">Trial</Badge>;
      case "basic":
        return <Badge className="bg-blue-100 text-blue-800">Basic</Badge>;
      case "premium":
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case "enterprise":
        return <Badge className="bg-gold-100 text-gold-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestione Pagamenti</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportPayments}>
            <Download className="w-4 h-4 mr-2" />
            Esporta Report
          </Button>
          <Button>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronizza Stripe
          </Button>
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fatturato Mensile</p>
                <p className="text-2xl font-bold text-green-600">€{totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abbonamenti Attivi</p>
                <p className="text-2xl font-bold text-blue-600">{activeSubscriptions}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scadute</p>
                <p className="text-2xl font-bold text-red-600">{expiredLicenses.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Scadenza</p>
                <p className="text-2xl font-bold text-orange-600">{expiringLicenses.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tutte le Licenze</TabsTrigger>
          <TabsTrigger value="expired">Scadute ({expiredLicenses.length})</TabsTrigger>
          <TabsTrigger value="expiring">In Scadenza ({expiringLicenses.length})</TabsTrigger>
          <TabsTrigger value="active">Attive ({activeSubscriptions})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tutte le Licenze</CardTitle>
              <CardDescription>
                Gestisci pagamenti e rinnovi di tutte le licenze
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
                    <TableHead>Canone Mensile</TableHead>
                    <TableHead>Scadenza</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead>Stripe ID</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {licenses.map((license: any) => (
                    <TableRow key={license.id}>
                      <TableCell className="font-medium">
                        {license.organizations?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getLicenseTypeBadge(license.license_type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        €{license.monthly_fee || 0}
                      </TableCell>
                      <TableCell>
                        {license.expires_at 
                          ? new Date(license.expires_at).toLocaleDateString('it-IT')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(license)}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {license.stripe_subscription_id || 'N/A'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRenewLicense(license.id)}
                          >
                            Rinnova
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleSuspendLicense(license.id)}
                          >
                            Sospendi
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

        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Licenze Scadute</CardTitle>
              <CardDescription>
                Licenze che necessitano di rinnovo immediato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Tipo Licenza</TableHead>
                    <TableHead>Scaduta il</TableHead>
                    <TableHead>Giorni di Ritardo</TableHead>
                    <TableHead>Canone</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiredLicenses.map((license: any) => {
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(license.expires_at).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <TableRow key={license.id}>
                        <TableCell className="font-medium">
                          {license.organizations?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getLicenseTypeBadge(license.license_type)}
                        </TableCell>
                        <TableCell>
                          {new Date(license.expires_at).toLocaleDateString('it-IT')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">{daysOverdue} giorni</Badge>
                        </TableCell>
                        <TableCell>€{license.monthly_fee || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm"
                              onClick={() => handleRenewLicense(license.id)}
                            >
                              Rinnova Ora
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle>Licenze in Scadenza</CardTitle>
              <CardDescription>
                Licenze che scadranno nei prossimi 30 giorni
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organizzazione</TableHead>
                    <TableHead>Tipo Licenza</TableHead>
                    <TableHead>Scade il</TableHead>
                    <TableHead>Giorni Rimanenti</TableHead>
                    <TableHead>Canone</TableHead>
                    <TableHead>Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expiringLicenses.map((license: any) => {
                    const daysRemaining = Math.ceil(
                      (new Date(license.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <TableRow key={license.id}>
                        <TableCell className="font-medium">
                          {license.organizations?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getLicenseTypeBadge(license.license_type)}
                        </TableCell>
                        <TableCell>
                          {new Date(license.expires_at).toLocaleDateString('it-IT')}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {daysRemaining} giorni
                          </Badge>
                        </TableCell>
                        <TableCell>€{license.monthly_fee || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRenewLicense(license.id)}
                            >
                              Rinnova
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Licenze Attive</CardTitle>
              <CardDescription>
                Licenze con pagamenti regolari e funzionanti
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tabella delle licenze attive */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
